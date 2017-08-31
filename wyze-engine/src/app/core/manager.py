from ..drivers.db import fetch_active_lambdas, get_lambda, deactivate_lambda
from ..drivers.remote import RemoteControl
from .subprocess import LambdaProcess
from threading import Thread


class EngineManager:
    def __init__(self):
        self.processes = {}
        self.lambdas = {}
        self.remote = RemoteControl()
        self.remote.register_command('reload', self.reload_lambda)
        self.remote.register_command('deactivate', self.deactivate_lambda)

    def start_lambda(self, _id):
        self.processes[_id] = LambdaProcess(
            data=self.lambdas[_id]
        )
        self.processes[_id].daemon = True
        self.processes[_id].start()
        print('[MAIN] Starting Lambda {}'.format(self.lambdas[_id]['name']))

    def kill_lambda(self, _id):
        process = self.processes.pop(_id, None)
        if process:
            process.terminate()

    def reload_lambda(self, _id):
        l = get_lambda(_id)
        if _id in self.lambdas:
            print('[MAIN] Terminating Lambda {}'.format(self.lambdas[_id]['name']))
        self.kill_lambda(_id)
        if l:
            self.lambdas[_id] = l
            self.start_lambda(_id)
        else:
            self.lambdas.pop(_id, None)

    def deactivate_lambda(self, _id, reason):
        print('[MAIN] Deactivating lambda {} due to {}'.format(_id, reason))
        deactivate_lambda(_id, reason)
        self.reload_lambda(_id)  # Kill and Remove

    def load_lambdas(self):
        lambdas = fetch_active_lambdas()
        print('[MAIN] Booting up {} lambdas'.format(len(lambdas)))
        self.processes = {}
        self.lambdas = {}
        for i in lambdas:
            _id = str(i['_id'])
            i['_id'] = _id
            self.lambdas[_id] = i
            self.start_lambda(_id)
        print('[MAIN] Bootup complete.')

    def run(self):
        self.load_lambdas()
        self.remote.run()

    def terminate(self):
        for i in self.processes.values():
            try:
                i.terminate()
            except Exception as e:
                print('Process can\'t terminate: ' + e.__repr__())
        self.remote.terminate()
