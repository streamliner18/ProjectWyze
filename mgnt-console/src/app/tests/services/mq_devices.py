from flask_testing import TestCase
from ...make_app import app
from ...app import app_mongo as mongo

from ...services.mqdevices import update_mqdevice, list_mqdevices, get_mqdevice, delete_mqdevice


class TestMQDevices(TestCase):
    def create_app(self):
        return app

    def setUp(self):
        mongo.db.drop_collection('lambdas')
        mongo.db.drop_collection('mqtemplates')
        mongo.db.drop_collection('mqdevices')

    def test_update_device(self):
        device = {
            'name': 'Test Device',
            'description': 'Test Description',
            'base_template': 'test_template',
            'device_id': '123abc',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqdevice(device, 'user_id')
        self.assertIsNotNone(_id)
        device = mongo.db.mqdevices.find_one()
        self.assertIsNotNone(device)
        self.assertIsNotNone(device['created'])
        self.assertEqual(device['created_by'], 'user_id')
        # Now let's add a binding
        device['channels'] = [{
            'rule': '/m/23',
            'alias': 'bedroom.light',
            'has_input': True
        }]
        _id = update_mqdevice(device, 'user_id')
        self.assertIsNotNone(_id)
        device = mongo.db.mqdevices.find_one()
        self.assertIsNotNone(device)
        self.assertEqual(len(device['channels']), 1)

    def test_retrieve_devices(self):
        device = {
            'name': 'Test Device',
            'description': 'Test Description',
            'base_template': 'test_template',
            'device_id': '123abc',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqdevice(device, 'user_id')
        device = get_mqdevice(_id)
        self.assertIsNotNone(device)

    def test_list_devices(self):
        device = {
            'name': 'Test Device',
            'description': 'Test Description',
            'base_template': 'test_template',
            'device_id': '123abc',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqdevice(device, 'user_id')
        devices = list_mqdevices()
        self.assertEqual(len(devices), 1)

    def test_delete_devices(self):
        device = {
            'name': 'Test Device',
            'description': 'Test Description',
            'base_template': 'test_template',
            'device_id': '123abc',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqdevice(device, 'user_id')
        delete_mqdevice(_id)
        devices = list_mqdevices()
        self.assertEqual(len(devices), 0)
