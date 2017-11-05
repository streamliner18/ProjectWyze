import pika

from app.drivers.env_conf import get_broker_address


def new_rabbitmq_connection():
    address = get_broker_address()
    conn = pika.BlockingConnection(pika.URLParameters(address))
    ch = conn.channel()
    return conn, ch