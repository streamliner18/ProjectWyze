from unittest import TestCase
from ...services.remote import get_broker_address, send_internal_signal
from pika import BlockingConnection, ConnectionParameters
from simplejson import loads


class TestRemote(TestCase):
    def testRCSignal(self):
        conn = BlockingConnection(
            ConnectionParameters(get_broker_address())
        )
        ch = conn.channel()
        ch.exchange_declare(
            exchange='wyze_internal',
            exchange_type='topic',
            durable=True
        )
        q = ch.queue_declare(exclusive=True).method.queue
        ch.queue_bind(q, 'wyze_internal', routing_key='ctrl.engine')
        send_internal_signal('engine', 'test_command', _id=1)
        method_frame, header_frame, body = ch.basic_get(q)
        if method_frame:
            ch.basic_ack(method_frame.delivery_tag)
            data = loads(body)
            self.assertIsNotNone(data)
            self.assertEqual(data['_id'], 1)
            self.assertEqual(data['command'], 'test_command')
        else:
            self.fail('Message did not come through')

