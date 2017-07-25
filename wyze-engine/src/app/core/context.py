from threading import RLock
from pika import BasicProperties


class SubprocessContext:
    def __init__(self):
        self._state = {}
        self._lock = RLock()

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
        self._channel.basic_publish(
            exchange='egress',
            routing_key=topic,
            body=body,
            properties=BasicProperties(
                delivery_mode=(2 if persistent else None)
            )
        )

    def log(self, msg, severity):
        self._channel.basic_publish(
            exchange='wyze_logging',
            # TODO: Put more info in log topics
            routing_key='logs.{}'.format(severity),
            body=msg
        )
