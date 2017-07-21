from . import *
from bson.objectid import ObjectId
from random import choice
from string import ascii_uppercase, digits


def add_invited_user(**kwargs):
    db = app_mongo.db
    kwargs['invite_id'] = ''.join(choice(ascii_uppercase + digits) for _ in range(8))
    assert 'email' not in kwargs
    return db.users.insert_one(kwargs)


def list_users():
    db = app_mongo.db
    return db.users.find({})


def remove_user(_id):
    db = app_mongo.db
    user = db.users.find_one(_id)
    if user and 'email' not in user:
        db.users.delete_one({
            '_id': _id
        })
        return True


def set_user_property(_id, **kwargs):
    db = app_mongo.db
    return db.update_one({'_id': _id}, {'$set': kwargs})
