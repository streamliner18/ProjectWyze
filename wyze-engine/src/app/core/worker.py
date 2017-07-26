from threading import Thread
from ..drivers.amq import make_connection
from .context import WorkerContext


class WorkerThread(Thread):
    def __init__(self, init_func, handle_func, parent, queue, **props):
        super().__init__()
        self._conn, self._ch = None, None
        self._queue = queue
        self.init_func = init_func
        self.handle_func = handle_func
        self.bindings = props['bindings']
        self.context = WorkerContext(parent)
        self.props = props

    def callback_handler(self, channel, methods, props, body):
        try:
            self.handle_func(body, self.context)
            channel.basic_ack(delivery_tag=methods.delivery_tag)
        except Exception as e:
            # Report the fucking error
            print('[{}] {} has error: {}'.format(self.props['name'], self.name, e.__repr__()))
            if not self.props['durable']:
                self.terminate(e.__repr__())

    def setup_connection(self):
        # First, set up a connection to the queue
        self._conn, self._ch = make_connection()
        # self._ch.add_on_close_callback(self.setup_connection)
        self.context.set_channel(self._ch)
        print('[{}] {} Warming up on queue {}'.format(self.props['name'], self.name, self._queue))
        # Now let's start setting up consumers
        self._ch.queue_declare(self._queue, auto_delete=True)
        bind_target = 'egress' if self.props['recursive'] else 'ingress'
        for i in self.props.get('bindings', []):
            self._ch.queue_bind(self._queue, bind_target, i)
        self._ch.basic_consume(
            self.callback_handler,
            self._queue,
            no_ack=False
        )

    def run(self, **kwargs):
        try:
            self.setup_connection()
            # Now to run the stuff
            if self.init_func is not None:
                self.init_func(self.context)
            print('[{}] {} is now alive.'.format(self.props['name'], self.name))
            self._ch.start_consuming()
        except Exception as e:
            print('[{}] {} Internal error: {}'.format(self.props['name'], self.name, e.__repr__()))

    def terminate(self, reason):
        self.context.terminate(reason)
        self._ch.stop_consuming()
        self._conn.close()
