import pika

from ..config.env_conf import get_broker_address


def make_connection():
    address = get_broker_address()
    conn = pika.BlockingConnection(pika.ConnectionParameters(address))
    ch = conn.channel()
    return conn, ch