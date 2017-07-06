import simplejson as json
from os import environ
from time import time

DEBUG = environ.get('DEBUG', False)


def to_json(body):
    try:
        body = json.loads(body)
        assert isinstance(body, dict)
        return body
    except:
        if isinstance(body, bytes):
            body = body.decode()
        return {"value": str(body)}


def stamp_tag(body, key, prop):
    body['key'] = key
    # body['timestamp'] = prop.timestamp
    # TODO: Figure out how to use native timestamp
    body['timestamp'] = int(time())
    return body


def mqtt_transkey(key):
    return key


def mqtt_cb(ch, method, prop, body):
    transkey = mqtt_transkey(method.routing_key)
    body_json = to_json(body)
    output = stamp_tag(
        body_json,
        transkey,
        prop
    )
    if DEBUG:
        print(output)
    ch.basic_publish(
        exchange="ingress",
        routing_key=transkey,
        body=json.dumps(output)
    )


def amqp_cb(ch, method, prop, body):
    body_json = to_json(body)
    output = stamp_tag(
        body_json,
        method.routing_key,
        prop
    )
    if DEBUG:
        print(output)
    ch.basic_publish(
        exchange="ingress",
        routing_key=method.routing_key,
        body=json.dumps(output)
    )