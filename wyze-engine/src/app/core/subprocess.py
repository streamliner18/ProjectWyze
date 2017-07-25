from multiprocessing import Process
from .context import SubprocessContext
from ..drivers.amq import make_connection
from .worker import WorkerThread


class LambdaProcess(Process):
    def __init__(self, data, **kwargs):
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
        # self._ch.add_on_close_callback(self.prepare_queue)
        self._queue = self._ch.queue_declare(auto_delete=True).method.queue
        self._ch.exchange_declare('egress', type='topic', durable=True)
        self._ch.exchange_declare('ingress', type='topic', durable=True)
        bind_target = 'egress' if self.data['recursive'] else 'ingress'
        for i in self.data.get('bindings', []):
            self._ch.queue_bind(self._queue, bind_target, i)

    def run(self, **kwargs):
        print('Lambda {} is booting up.'.format(self.data['name']))
        self.compile_code(self.data['code'])
        self.prepare_queue()
        threads = [
            WorkerThread(
                self.init_func,
                self.handle_func,
                parent=self.context,
                queue=self._queue,
                **self.data
            )
            for _ in range(self.data['workers'])]
        for i in threads:
            i.start()
        for i in threads:
            i.join()
