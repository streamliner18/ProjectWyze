def setup_pipelines(ch):
    # Setup for outgoing exchange
    ch.exchange_declare(
        exchange='ingress',
        exchange_type='topic',
        durable=True
    )

    # Setup for MQTT transaction
    mqtt_q = ch.queue_declare(auto_delete=True).method.queue
    ch.queue_bind(
        exchange='amq.topic',
        queue=mqtt_q,
        routing_key="#"
    )

    # Setup for AMQP transaction
    ch.exchange_declare(
        exchange='incoming',
        exchange_type='topic',
        durable=True
    )
    amqp_q = ch.queue_declare(auto_delete=True).method.queue
    ch.queue_bind(
        exchange='incoming',
        queue=amqp_q,
        routing_key='#'
    )
    return mqtt_q, amqp_q
