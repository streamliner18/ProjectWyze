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
    data = list(cursor)
    for i in data:
        i['_id'] = str(i['_id'])
    return data


def get_mqdevice(_id):
    db = app_mongo.db
    data = db.mqdevices.find_one(ObjectId(_id))
    data['_id'] = str(data['_id'])
    return data


def delete_mqdevice(_id):
    db = app_mongo.db

    db.mqdevices.delete_one({'_id': ObjectId(_id)})
