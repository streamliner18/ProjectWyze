from . import *
from bson.objectid import ObjectId
from datetime import datetime
from .remote import RCRouter


def update_mqtemplate(data, user_id):
    db = app_mongo.db
    if '_id' not in data:
        data['created_by'] = str(user_id)
        data['created'] = datetime.utcnow()
        _id = db.mqtemplates.insert_one(data).inserted_id
    else:
        data['_id'] = ObjectId(data['_id'])
        _id = data['_id']
        db.mqtemplates.replace_one({'_id': _id}, data)
    return str(_id)


def get_mqtemplate(_id):
    db = app_mongo.db
    data = db.mqtemplates.find_one(ObjectId(_id))
    data['_id'] = str(data['_id'])
    return data


def list_mqtemplates():
    db = app_mongo.db
    cursor = db.mqtemplates.find({})
    data = list(cursor)
    for i in data:
        i['_id'] = str(i['_id'])
    return data


def update_mqdevices(_id):
    db = app_mongo.db
    data = get_mqtemplate(_id)
    assert data
    extracted = {k: data[k] for k in 'channels input_key output_key'.split()}
    db.mqdevices.update_many({'base_template': _id}, {'$set': extracted})
    RCRouter.reload()


def delete_mqtemplate(_id):
    db = app_mongo.db
    db.mqtemplates.delete_one({'_id': ObjectId(_id)})