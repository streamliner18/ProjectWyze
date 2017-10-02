from pika import BlockingConnection, ConnectionParameters
from os import environ
from contextlib import contextmanager
from simplejson import dumps


def get_broker_address():
    return environ.get('BROKER_ADDRESS') or 'localhost'


@contextmanager
def amq_channel(exchange):
    conn = BlockingConnection(
        ConnectionParameters(get_broker_address())
    )
    ch = conn.channel()
    ch.confirm_delivery()
    ch.exchange_declare(
        exchange=exchange,
        exchange_type='topic',
        durable=True
    )
    yield ch
    conn.close()


def send_internal_signal(target, command, **kwargs):
    with amq_channel('wyze_internal') as ch:
        kwargs['command'] = command
        ch.basic_publish(
            exchange='wyze_internal',
            routing_key='ctrl.' + target,
            body=dumps(kwargs)
        )


class RCLambda:
    @classmethod
    def reload(cls, _id):
        send_internal_signal('engine', 'reload', _id=_id)


class RCRouter:
    @classmethod
    def reload(cls):
        send_internal_signal('router', 'reload')
