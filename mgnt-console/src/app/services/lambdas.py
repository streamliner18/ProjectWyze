from . import *
from bson.objectid import ObjectId
from .seeds import empty_lambda


def add_lambda(user_id):
    db = app_mongo.db
    inserted_id = db.lambdas.insert_one(empty_lambda(user_id)).inserted_id
    return str(inserted_id)


def update_lambda(data):
    db = app_mongo.db
    db.lambdas.replace_one({'_id': data['_id']}, data)


def get_lambda(_id):
    db = app_mongo.db
    return db.lambdas.find_one(ObjectId(_id))


def list_lambdas():
    db = app_mongo.db
    cursor = db.lambdas.find(projection='name language bindings bind_multithread workers status remarks'.split())
    return list(cursor)


def delete_lambda(_id):
    db = app_mongo.db
    db.lambdas.delete_one({'_id': ObjectId(_id)})
