import pika
import simplejson as json

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
ch = connection.channel()

q = ch.queue_declare(exclusive=True)

ch.queue_bind(exchange='ingress', queue=q.method.queue,
              routing_key="#")


def cb(ch, method, prop, body):
    print(json.loads(body))


ch.basic_consume(cb, queue=q.method.queue, no_ack=True)

ch.start_consuming()
