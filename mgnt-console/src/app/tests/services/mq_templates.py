from flask_testing import TestCase
from ...make_app import app
from ...app import app_mongo as mongo

from ...services.mqtemplates import update_mqtemplate, get_mqtemplate, list_mqtemplates, update_mqdevices, delete_mqtemplate
from ...services.mqdevices import update_mqdevice, get_mqdevice


class TestMQTemplates(TestCase):
    def create_app(self):
        return app

    def setUp(self):
        mongo.db.drop_collection('lambdas')
        mongo.db.drop_collection('mqtemplates')
        mongo.db.drop_collection('mpdevices')

    def test_update_template(self):
        template = {
            'name': 'Test Template',
            'description': 'Test Description',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqtemplate(template, 'user_id')
        self.assertIsNotNone(_id)
        template = mongo.db.mqtemplates.find_one()
        self.assertIsNotNone(template)
        self.assertIsNotNone(template['created'])
        self.assertEqual(template['created_by'], 'user_id')
        # Now let's add a binding
        template['channels'] = [{
            'rule': '/m/23',
            'alias': 'bedroom.light',
            'has_input': True
        }]
        _id = update_mqtemplate(template, 'user_id')
        self.assertIsNotNone(_id)
        template = mongo.db.mqtemplates.find_one()
        self.assertIsNotNone(template)
        self.assertEqual(len(template['channels']), 1)

    def test_retrieve_template(self):
        template = {
            'name': 'Test Template',
            'description': 'Test Description',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqtemplate(template, 'user_id')
        template = get_mqtemplate(_id)
        self.assertIsNotNone(template)

    def test_list_templates(self):
        template = {
            'name': 'Test Template',
            'description': 'Test Description',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqtemplate(template, 'user_id')
        devices = list_mqtemplates()
        self.assertEqual(len(devices), 1)

    def test_delete_templates(self):
        template = {
            'name': 'Test Template',
            'description': 'Test Description',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        _id = update_mqtemplate(template, 'user_id')
        delete_mqtemplate(_id)
        devices = list_mqtemplates()
        self.assertEqual(len(devices), 0)

    def test_update_devices(self):
        # First we have a template and a device
        template = {
            'name': 'Test Template',
            'description': 'Test Description',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        template_id = update_mqtemplate(template, 'user_id')
        device = {
            'name': 'Test Device',
            'description': 'Test Description',
            'base_template': template_id,
            'device_id': '123abc',
            'input_key': 'status',
            'output_key': 'command',
            'channels:': []
        }
        device_id = update_mqdevice(device, 'user_id')
        # Something changed about the template
        template['channels'] = [{
            'rule': '/m/23',
            'alias': 'bedroom.light',
            'has_input': True
        }]
        update_mqtemplate(template, 'user_id')
        # We apply everything to the devices
        update_mqdevices(template_id)
        device = get_mqdevice(device_id)
        self.assertIsNotNone(device)
        self.assertEqual(len(device['channels']), 1)