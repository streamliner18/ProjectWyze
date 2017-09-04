from multiprocessing import Process
from multiprocessing import cpu_count
from .core.driver import make_connection
from .core.pipelines import setup_exchanges, setup_routes
from .core.mapper import MQTTMapper
from pika.exceptions import ChannelClosed, ConnectionClosed
from .config.env_conf import get_redis_address, get_n_of_threads
from redis import StrictRedis


class RouterThread(Process):
    def __init__(self, routes):
        super(RouterThread, self).__init__()
        self.conn, self.ch = None, None
        self.redis = None
        self.mapper = MQTTMapper()
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

    def run(self):
        self.mapper.begin()
        self.conn, self.ch = make_connection()
        self.redis = StrictRedis(get_redis_address())
        self.bind_routes()
        self.ch.start_consuming()


class Router:
    def __init__(self):
        self.conn, self.ch = None, None
        self.routes = {}

    def run(self):
        self.conn, self.ch = make_connection()
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
