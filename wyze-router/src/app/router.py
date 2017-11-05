from multiprocessing import Process
from multiprocessing import cpu_count

from .core.pipelines import setup_exchanges, setup_routes
from .core.mapper import MQTTMapper
from pika.exceptions import ChannelClosed, ConnectionClosed
from .drivers.rabbitmq import new_rabbitmq_connection
from .drivers.mongodb import new_mongodb_connection
from .drivers.env_conf import *
from redis import StrictRedis
from time import sleep


class RouterThread(Process):
    def __init__(self, routes):
        super(RouterThread, self).__init__()
        self.conn, self.ch = None, None
        self.redis = None
        self.db = None
        self.mapper = MQTTMapper()
        self.remote_q = None
        self.routes = routes

    def wrapped_routing(self, route):
        def _wrapped(ch, method, props, body):
            return self.routes[route]['callback'](
                self, ch, method, props, body
            )
        return _wrapped

    def bind_routes(self):
        print('{} spooling up on {} routes...'.format(self.name, len(self.routes)))
        for k, v in self.routes.items():
            self.ch.queue_declare(auto_delete=True, queue=v['queue'])
            self.ch.basic_consume(
                self.wrapped_routing(k),
                queue=v['queue'],
                no_ack=True
            )

    def setup_autoreload(self):
        def reload(c, m, p, b):
            print('{} reloading mapper'.format(self.name))
            self.mapper.begin()

        self.ch.exchange_declare(
            'wyze_internal',
            exchange_type='topic',
            durable=True
        )
        self.remote_q = self.ch.queue_declare(exclusive=True).method.queue
        self.ch.queue_bind(self.remote_q, 'wyze_internal', 'ctrl.router')
        self.ch.basic_consume(
            reload,
            queue=self.remote_q,
            no_ack=True
        )

    def run(self):
        try:
            self.mapper.begin()
            # Set up all extensions
            self.conn, self.ch = new_rabbitmq_connection()
            self.redis = StrictRedis(get_redis_address())
            _, self.db = new_mongodb_connection()
            self.db.warehouse.create_index('key')
            self.db.warehouse.create_index('timestamp')
            # Initialize pipeline
            self.bind_routes()
            self.setup_autoreload()
            self.ch.start_consuming()
        except Exception as e:
            print("Fatal: {}".format(e.__repr__()))


class Router:
    def __init__(self):
        self.conn, self.ch = None, None
        self.routes = {}

    def run(self):
        self.conn, self.ch = new_rabbitmq_connection()
        setup_exchanges(self.ch)
        self.routes = setup_routes(self.ch)
        # Pipeline setup complete, start spawning everything
        threads = [
            RouterThread(self.routes)
            for _ in range(get_n_of_threads())
            ]
        try:
            for i in threads:
                print('Starting thread {}'.format(i.name))
                i.start()
            while True:
                for i in threads:
                    if i.is_alive():
                        i.join(0.5)
                    else:
                        print('{} has died, restarting'.format(i.name))
                        threads.remove(i)
                        sleep(0.5)
                        new_thr = RouterThread(self.routes)
                        threads.append(new_thr)
                        new_thr.daemon = True
                        new_thr.start()
                        new_thr.join(0.5)
        except KeyboardInterrupt:
            for i in threads:
                if i.is_alive():
                    i.terminate()
            try:
                self.conn.close()
            except ConnectionClosed:
                pass
