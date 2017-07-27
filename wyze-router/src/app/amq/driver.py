import pika

from ..config.env_conf import get_broker_address

address = get_broker_address()
print('RabbitMQ address: {}'.format(address))
connection = pika.BlockingConnection(pika.ConnectionParameters(address))

ch = connection.channel()