from flask_testing import TestCase
from ...make_app import app
from ...app import app_mongo as mongo

from ...services.lambdas import add_lambda, update_lambda, get_lambda, list_lambdas, delete_lambda


class TestMQTemplates(TestCase):
    def create_app(self):
        return app

    def setUp(self):
        mongo.db.drop_collection('lambdas')
        mongo.db.drop_collection('mqtemplates')
        mongo.db.drop_collection('mqdevices')