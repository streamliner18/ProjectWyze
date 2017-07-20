from . import *
from bson.objectid import ObjectId
from datetime import datetime


def update_mqtemplate(data, user_id):
    db = app_mongo.db
    if '_id' not in data:
        data['created_by'] = user_id
        data['created'] = datetime.utcnow()
        _id = db.mqtemplates.insert_one(data).inserted_id
    else:
        _id = data['_id']
        db.mqtemplates.replace_one({'_id': ObjectId(_id)}, data)
    return str(_id)


def get_mqtemplate(_id):
    db = app_mongo.db
    return db.mqtemplates.find_one(ObjectId(_id))


def list_mqtemplates():
    db = app_mongo.db
    cursor = db.mqtemplates.find({})
    return list(cursor)


def update_mqdevices(_id):
    db = app_mongo.db
    data = get_mqtemplate(_id)
    assert data
    extracted = {k: data[k] for k in 'channels input_key output_key'.split()}
    db.mqdevices.update_many({'base_template': _id}, {'$set': extracted})


def delete_mqtemplate(_id):
    db = app_mongo.db
    db.mqtemplates.delete_one({'_id': ObjectId(_id)})