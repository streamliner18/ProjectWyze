import pika

from .env import get_broker_address


def on_channel_open(channel):
    channel.basic_qos(prefetch_count=1)


def make_connection():
    address = get_broker_address()
    print('RabbitMQ address: {}'.format(address))
    connection = pika.BlockingConnection(pika.ConnectionParameters(address))
    ch = connection.channel()
    return connection, ch


connection, ch = make_connection()
