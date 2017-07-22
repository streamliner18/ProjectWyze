from pymongo import MongoClient

from .env_conf import get_mongo_address

address = get_mongo_address()
client = MongoClient(get_mongo_address())
db = client[address.split('/')[-1]]


def list_raw_devices():
    collection = db.mqdevices
    return list(collection.find({}))

