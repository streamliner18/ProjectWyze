from .driver import ch
from .processing import mqtt_cb, amqp_cb


def setup_pipelines():
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
