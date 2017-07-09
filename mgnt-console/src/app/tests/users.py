from flask_testing import TestCase
from ..make_app import app
from ..app import app_mongo as mongo

from ..services.users import add_invited_user, list_users, remove_user, set_user_property
from ..services.auth import user_register, user_login

class TestUsers(TestCase):
    def create_app(self):
        return app

    def setUp(self):
        mongo.db.drop_collection('users')

    def test_create_user_normal(self):
        add_invited_user(role='admin')
        user = mongo.db.users.find_one()
        self.assertIsNotNone(user)
        self.assertEqual(user['role'], 'admin')
        self.assertIsNotNone(user.get('invite_id'))

    def test_create_user_has_email(self):
        with self.assertRaises(AssertionError):
            add_invited_user(email='test@test.com')

    def test_register_user_normal(self):
        _id = mongo.db.users.insert_one({
            'invite_id': 'testing',
            'role': 'admin'
        }).inserted_id
        res = user_register('testing', 'root@root.com', '123456')
        self.assertIsNotNone(res)
        self.assertEqual(res, str(_id))
        user = mongo.db.users.find_one({'_id': _id})
        self.assertIsNotNone(user.get('email'))
        self.assertIsNotNone(user.get('pwhash'))

    def test_register_user_no_invitation(self):
        res = user_register('testing', 'root@root.com', '123456')
        self.assertIsNone(res)

    def test_register_user_already_registered(self):
        _id = mongo.db.users.insert_one({
            'invite_id': 'testing',
            'role': 'admin'
        })
        user_register('testing', 'root@root.com', '123456')
        res = user_register('testing', 'root@root.com', '123456')
        self.assertIsNone(res)

    def test_remove_user_unregistered(self):
        _id = mongo.db.users.insert_one({
            'invite_id': 'testing',
            'role': 'admin'
        }).inserted_id
        self.assertTrue(remove_user(_id))

    def test_remove_user_registered(self):
        _id = mongo.db.users.insert_one({
            'invite_id': 'testing',
            'role': 'admin'
        }).inserted_id
        user_register('testing', 'root@root.com', '123456')
        self.assertIsNone(remove_user(_id))