from pika import BlockingConnection, ConnectionParameters
from pika.exceptions import ConnectionClosed
from os import environ
from click import command, option


def make_connection():
    address = environ.get('BROKER') or 'localhost'
    conn = BlockingConnection(
        ConnectionParameters(address)
    )
    ch = conn.channel()
    return conn, ch


def cb(ch, methods, props, body):
    print(body)


@command()
@option('--exchange', '-e', default='wyze_internal', help='Which exchange to listen to.')
@option('--bind', '-b', multiple=True, help='Specify your binding keys.')
@option('--transient', '-t', is_flag=True, help='Use this if you\'re not using a durable exchange.')
def listen(exchange, bind, transient):
    """Listens to the exchange with binding keys of your choice."""
    print('Connecting to broker...')
    try:
        conn, ch = make_connection()
    except ConnectionClosed:
        print('The connection was closed. Do you have a broker running?')
    ch.exchange_declare(
        exchange,
        type='topic',
        durable=(not transient)
    )
    q = ch.queue_declare(exclusive=True).method.queue
    for i in bind:
        print('Binding with routing key: ' + i)
        ch.queue_bind(q, exchange, routing_key=i)
    print('Setup complete. Listening...')
    ch.basic_consume(cb, q, no_ack=True)
    try:
        ch.start_consuming()
    except KeyboardInterrupt:
        conn.close()


if __name__ == '__main__':
    listen()
