import pika
import sys
import simplejson as json

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
ch = connection.channel()

q = ch.queue_declare(exclusive=True)

severities = sys.argv[1:]
for i in severities:
    ch.queue_bind(exchange='amq.topic', queue=q.method.queue,
                  routing_key=i)


def cb(ch, method, prop, body):
    try:
        b = json.loads(body)
    except:
        b = {"msg": str(body)}
    b['key'] = method.routing_key
    print(b)


ch.basic_consume(cb, queue=q.method.queue, no_ack=True)

ch.start_consuming()
