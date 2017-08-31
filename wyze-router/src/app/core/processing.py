import simplejson as json
from os import environ
from uuid import uuid1
from base64 import encodebytes, decodebytes

DEBUG = environ.get('DEBUG', False)


def to_object(body):
    try:
        body = json.loads(body)
        if not isinstance(body, dict):
            body = {'value': body}
        body['decoder'] = 'json'
        return body
    except Exception:
        try:
            return {'value': body.decode('utf-8'), 'decoder': 'utf-8'}
        except Exception:
            return {"value": encodebytes(body), 'decoder': 'base64'}


def from_object(body):
    try:
        body = json.loads(body)
        assert 'value' in body
        msg_type = body['decoder']
        if msg_type == 'base64':
            return decodebytes(body['value'].encode('utf-8'))
        elif msg_type == 'utf-8':
            return body['value'].encode('utf-8')
        return body
    except Exception:
        return body


def stamp_tag(body, key, prop):
    body = to_object(body)
    body['key'] = key
    body['timestamp'] = prop.timestamp
    body['_id'] = str(uuid1())
    return json.dumps(body)
