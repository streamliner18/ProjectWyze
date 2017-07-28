import simplejson as json
from os import environ
from uuid import uuid1

DEBUG = environ.get('DEBUG', False)


def to_object(body):
    try:
        body = json.loads(body)
        assert isinstance(body, dict)
        return body
    except Exception:
        if isinstance(body, bytes):
            body = body.decode()
        return {"value": str(body)}


def stamp_tag(body, key, prop):
    body = to_object(body)
    body['key'] = key
    body['timestamp'] = prop.timestamp
    body['_id'] = str(uuid1())
    return json.dumps(body)
