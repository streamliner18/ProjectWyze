from pymongo import MongoClient

from .env_conf import get_mongo_address


def list_raw_devices():
    address = get_mongo_address()
    print("Mongo address is {}".format(address))
    client = MongoClient(get_mongo_address())
    db = client[address.split('/')[-1]]
    collection = db.mqdevices
    return list(collection.find({}))

