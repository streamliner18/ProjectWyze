from . import *
from bson.objectid import ObjectId
from datetime import datetime


def update_mqdevice(data, user_id):
    db = app_mongo.db
    if '_id' not in data:
        data['created_by'] = user_id
        data['created'] = datetime.utcnow()
        _id = db.mqdevices.insert_one(data).inserted_id
    else:
        _id = data['_id']
        db.mqdevices.replace_one({'_id': ObjectId(_id)}, data)
    return str(_id)


def list_mqdevices():
    db = app_mongo.db
    cursor = db.mqdevices.find({})
    return list(cursor)


def get_mqdevice(_id):
    db = app_mongo.db
    return db.mqdevices.find_one(ObjectId(_id))


def delete_mqdevice(_id):
    db = app_mongo.db
    db.mqdevices.delete_one({'_id': ObjectId(_id)})