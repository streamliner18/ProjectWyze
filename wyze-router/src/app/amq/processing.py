import simplejson as json
from os import environ
from uuid import uuid1
from .mqtt_map import mqtt_transkey, global_mqtt_mappings

DEBUG = environ.get('DEBUG', False)


def to_json(body):
    try:
        body = json.loads(body)
        assert isinstance(body, dict)
        return body
    except Exception:
        if isinstance(body, bytes):
            body = body.decode()
        return {"value": str(body)}


def stamp_tag(body, key, prop):
    body['key'] = key
    body['timestamp'] = prop.timestamp
    body['_id'] = str(uuid1())
    return body


def mqtt_cb(ch, method, prop, body):
    try:
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
    except Exception as e:
        print("Dropping message, reason: {}".format(e.__repr__()))


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
