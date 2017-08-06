from . import *
from bson.objectid import ObjectId
from .seeds import empty_lambda
from .remote import RCLambda


def add_lambda(user_id):
    db = app_mongo.db
    user_id = str(user_id)
    inserted_id = db.lambdas.insert_one(empty_lambda(user_id)).inserted_id
    return str(inserted_id)


def update_lambda(data):
    db = app_mongo.db
    data['_id'] = ObjectId(data['_id'])
    data['workers'] = int(data.get('workers', 1))
    db.lambdas.replace_one({'_id': data['_id']}, data)
    RCLambda.reload(str(data['_id']))


def get_lambda(_id):
    db = app_mongo.db
    data = db.lambdas.find_one(ObjectId(_id))
    data['_id'] = str(data['_id'])
    return data


def list_lambdas():
    db = app_mongo.db
    cursor = db.lambdas.find(projection='name language bindings bind_multithread workers status remarks active'.split())
    data = list(cursor)
    for i in data:
        i['_id'] = str(i['_id'])
    return data


def delete_lambda(_id):
    db = app_mongo.db
    db.lambdas.delete_one({'_id': ObjectId(_id)})


def count_lambdas():
    db = app_mongo.db
    c_total = db.lambdas.find().count()
    c_active = db.lambdas.find({'active': True}).count()
    return {
        'total': c_total,
        'active': c_active,
        'active_ratio': int(c_active / c_total * 100)
    }


def count_lambda_load():
    lambdas = list_lambdas()
    c_active, c_total = 0, 0
    for i in lambdas:
        if i.get('bind_multithreaded'):
            incr = i['workers'] * (len(i['bindings']) + 1)
        else:
            incr = i['workers']
        c_total += incr
        if i['active']:
            c_active += incr
    return {
        'active': c_active,
        'total': c_total,
        'active_ratio': int(c_active / c_total * 100)
    }
