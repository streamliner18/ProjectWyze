from multiprocessing import Process
from .context import SubprocessContext
from ..drivers.amq import make_connection
from .worker import WorkerThread
from uuid import uuid4
from simplejson import dumps


class LambdaProcess(Process):
    def __init__(self, data):
        super().__init__()
        self._conn, self._ch = None, None
        self.context = SubprocessContext()
        self.runtime_global = {}
        self.init_func = None
        self.handle_func = None
        self.data = data
        self._queue = ''

    def compile_code(self, code_s):
        code = compile(code_s, '<string>', 'exec')
        exec(code, self.runtime_global)
        self.init_func = self.runtime_global.get('init', None)
        self.handle_func = self.runtime_global.get('handle_input', None)
        if not self.handle_func:
            raise ValueError('Codefile missing "handle_input" definition.')

    def prepare_queue(self):
        self._conn, self._ch = make_connection()
        self._queue = str(uuid4())
        self._ch.exchange_declare('egress', type='topic', durable=True)
        self._ch.exchange_declare('ingress', type='topic', durable=True)
        self._conn.close()

    def deactivate(self, reason):
        self._conn, self._ch = make_connection()
        if self.data:
            compliant = {
                'command': 'deactivate',
                '_id': self.data['_id'],
                'reason': reason
            }
            self._ch.basic_publish(
                'wyze_internal',
                routing_key='ctrl.engine',
                body=dumps(compliant)
            )

    def run(self, **kwargs):
        print('[{}] PROCESS booting up.'.format(self.data['name']))
        try:
            self.compile_code(self.data['code'])
        except Exception as e:
            print('[{}] PROCESS compilation error: {}'.format(self.data['name'], e.__str__()))
            self.deactivate(e.__str__() if e.__str__() else e.__repr__())
            return
        self.prepare_queue()
        make_thread = lambda: WorkerThread(
            self.init_func,
            self.handle_func,
            parent=self.context,
            queue=self._queue,
            **self.data
        )

        threads = [
            make_thread()
            for _ in range(self.data['workers'])]
        for i in threads:
            i.start()
        while True:
            if self.context.signal == 'terminate':
                print('[{}] PROCESS Received kill signal, because {}'.format(
                    self.data['name'],
                    self.context.signal_remark
                ))
                self.deactivate()
                raise Exception(self.context.signal_remark)
            for i in threads:
                if i.is_alive():
                    i.join(0.5)
                else:
                    print('[{}] PROCESS {} has died: Restarting.'.format(
                        self.data['name'],
                        i.name
                    ))
                    threads.remove(i)
                    new_thr = make_thread()
                    threads.append(new_thr)
                    new_thr.start()
                    new_thr.join(0.5)
