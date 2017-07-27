from flask_testing import TestCase
from ...make_app import app
from ...app import app_mongo as mongo

from ...services.lambdas import add_lambda, update_lambda, get_lambda, list_lambdas, delete_lambda


class TestLambdas(TestCase):
    def create_app(self):
        return app

    def setUp(self):
        mongo.db.drop_collection('lambdas')
        mongo.db.drop_collection('mqtemplates')
        mongo.db.drop_collection('mqdevices')

    def test_add_lambda(self):
        # First we add one
        l1_id = add_lambda('user1')
        l1 = mongo.db.lambdas.find_one()
        self.assertIsNotNone(l1)
        self.assertEqual(l1['created_by'], 'user1')
        self.assertEqual(str(l1['_id']), l1_id)
        # Then we add another one
        l2_id = add_lambda('user2')
        self.assertEqual(mongo.db.lambdas.find().count(), 2)

    def test_get_lambda(self):
        l1_id = add_lambda('user1')
        l1 = get_lambda(l1_id)
        self.assertIsNotNone(l1)
        self.assertEqual(l1['created_by'], 'user1')

    def test_update_lambda(self):
        l1_id = add_lambda('user1')
        l1 = get_lambda(l1_id)
        l1['active'] = True
        l1['workers'] = '4'
        update_lambda(l1)
        # Make sure there's only one
        self.assertEqual(mongo.db.lambdas.find().count(), 1)
        # Make sure the thing still retrieves
        l1 = get_lambda(l1_id)
        self.assertIsNotNone(l1)
        # Make sure the change has taken place
        self.assertEqual(l1['active'], True)
        self.assertEqual(l1['workers'], 4)

    def test_list_lambdas(self):
        l1_id = add_lambda('user1')
        l2_id = add_lambda('user2')
        templates = list_lambdas()
        self.assertEqual(len(templates), 2)

    def test_delete_lambdas(self):
        pass
