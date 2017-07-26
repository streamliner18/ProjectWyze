from .amq import make_connection
from simplejson import loads


class RemoteControl:
    def __init__(self):
        self.conn, self.ch = None, None
        self.command_dict = {}
        self.setup_conn()

    def register_command(self, command, func):
        self.command_dict[command] = func

    def setup_conn(self):
        self.conn, self.ch = make_connection()
        self.ch.exchange_declare(
            'wyze_internal',
            exchange_type='topic',
            durable=False
        )
        self.q = self.ch.queue_declare(exclusive=True).method.queue
        self.ch.queue_bind(self.q, 'wyze_internal', 'ctrl.engine')
        self.ch.basic_consume(self.amq_rc_callback, self.q, no_ack=True)

    def amq_rc_callback(self, ch, methods, props, body):
        """
            This callback handles processing of remote control messages.
            The message should follow the format as following:
                - command: What to do (reload, deactivate)
                - **kwargs: Arguments to feed into the function
        """
        d = loads(body)
        command = d.pop('command')
        try:
            self.command_dict[command](**d)
        except KeyError:
            pass
        ch.basic_ack(delivery_tag=methods.delivery_tag)

    def run(self):
        try:
            self.ch.start_consuming()
        except Exception as e:
            print('[RC] Error: {}'.format(e.__repr__()))
            self.run()

    def terminate(self):
        self.ch.stop_consuming()
