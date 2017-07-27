from os import environ


def get_broker_address():
    return environ.get('BROKER_ADDRESS') or 'localhost'


def get_mongo_address():
    return environ.get('MONGO_URL') or 'mongodb://localhost:27017/wyze-dev'
