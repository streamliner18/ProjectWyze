import simplejson as json
from os import environ
from uuid import uuid1
from base64 import encodebytes

DEBUG = environ.get('DEBUG', False)


def to_object(body):
    try:
        body = json.loads(body)
        assert isinstance(body, dict)
        body['decoder'] = 'json'
        return body
    except Exception:
        try:
            return {'value': body.decode('utf-8'), 'decoder': 'utf-8'}
        except Exception:
            return {"value": encodebytes(body), 'decoder': 'base64'}


def stamp_tag(body, key, prop):
    body = to_object(body)
    body['key'] = key
    body['timestamp'] = prop.timestamp
    body['_id'] = str(uuid1())
    return json.dumps(body)
