import pika
from processing import mqtt_cb, amqp_cb
from os import environ
from pika import exceptions
from pika.adapters import twisted_connection
from twisted.internet import defer, reactor, protocol,task

print("Configuring RabbitMQ connection...")

address = environ.get("BROKER_ADDRESS", 'localhost')
connection = pika.BlockingConnection(pika.ConnectionParameters(address))
ch = connection.channel()

print("Connecting to broker on address {}".format(address))

# Setup for outgoing exchange
ch.exchange_declare(
    exchange='ingress',
    exchange_type='topic',
    durable=True
)

# Setup for MQTT transaction
mqtt_q = ch.queue_declare(exclusive=True)
ch.queue_bind(
    exchange='amq.topic',
    queue=mqtt_q.method.queue,
    routing_key="#"
)
ch.basic_consume(mqtt_cb, queue=mqtt_q.method.queue, no_ack=True)

# Setup for AMQP transaction
ch.exchange_declare(
    exchange='incoming',
    exchange_type='topic',
    durable=True
)
amqp_q = ch.queue_declare(exclusive=True)
ch.queue_bind(
    exchange='incoming',
    queue=amqp_q.method.queue,
    routing_key='#'
)
ch.basic_consume(amqp_cb, queue=amqp_q.method.queue, no_ack=True)

print("Configuration complete.")

# Start the thing
ch.start_consuming()
