from . import *
from pymongo import ASCENDING, DESCENDING


def build_database():
    db = app_mongo.db
    # User indexes
    db['users'].create_index('email')
    db['users'].create_index('invite_id')
    # Config indexes
    db['config'].create_index('key')


def initial_database_seed(force=False):
    db = app_mongo.db
    config_item = db['config'].find_one({'key': 'init_seed'})
    if config_item and not force:
        raise Exception('The database has been seeded before, aborting.')
    db.drop_collection('users')
    db.users.insert_one({
        'invite_id': 'root',
        'role': 'admin'
    })