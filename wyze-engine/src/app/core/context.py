from threading import RLock
from pika import BasicProperties
import simplejson as json
from base64 import encodebytes


def to_object(body):
    if not (isinstance(body, str) or isinstance(body, bytes)):
        b = str(body)
    else:
        b = body
    try:
        body = json.loads(b)
        assert isinstance(body, dict)
        body['decoder'] = 'json'
        return body
    except Exception:
        try:
            if isinstance(b, bytes):
                b = b.decode('utf-8')
            return {'value': b, 'decoder': 'utf-8'}
        except Exception:
            return {"value": encodebytes(b), 'decoder': 'base64'}


class SubprocessContext:
    def __init__(self):
        self._state = {}
        self._lock = RLock()
        self.signal = None
        self.signal_remark = ''

    def set_state(self, key, value):
        with self._lock:
            self._state[key] = value

    def get_state(self, key, default=None):
        with self._lock:
            result = self._state.get(key, default)
            return result

    def unset_state(self, key):
        with self._lock:
            if key in self._state:
                del self._state[key]

    def terminate(self, remark):
        self.signal = 'terminate'
        self.signal_remark = remark


class WorkerContext:
    def __init__(self, parent_context):
        self._parent = parent_context
        self._channel = None

    def set_channel(self, ch):
        self._channel = ch

    def set_state(self, *args, **kwargs):
        return self._parent.set_state(*args, **kwargs)

    def get_state(self, *args, **kwargs):
        return self._parent.get_state(*args, **kwargs)

    def unset_state(self, *args, **kwargs):
        return self._parent.unset_state(*args, **kwargs)

    def emit(self, topic, body, persistent=False):
        body = to_object(body)
        self._channel.basic_publish(
            exchange='outgoing',
            routing_key=topic,
            body=json.dumps(body),
            properties=BasicProperties(
                delivery_mode=(2 if persistent else None)
            )
        )

    def log(self, msg, severity):
        self._channel.basic_publish(
            exchange='outgoing',
            # TODO: Put more info in log topics
            routing_key='logs.{}'.format(severity),
            body=msg
        )

    def terminate(self, remark):
        self._parent.terminate(remark)
