from pymongo import MongoClient
from .env import get_mongo_address, get_mongo_dbname
from bson import ObjectId

client = MongoClient(get_mongo_address())
db = client[get_mongo_dbname()].lambdas


def fetch_active_lambdas(**kwargs):
    return list(db.find({
        'active': True
    }))


def get_lambda(_id, **kwargs):
    data = db.find_one(ObjectId(_id))
    if data and data['active']:
        return data
    return None


def deactivate_lambda(_id, reason, **kwargs):
    db.update_one(
        ObjectId(_id),
        {'$set': {
            'active': False,
            'remarks': reason
        }}
    )
