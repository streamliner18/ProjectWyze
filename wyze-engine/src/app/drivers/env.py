from os import environ


def get_broker_address():
    return environ.get('RABBIT_URL') or 'amqp://localhost/'


def get_mongo_address():
    return environ.get('MONGO_URL') or 'mongodb://localhost:27017/wyze-dev'


def get_mongo_dbname():
    uri = environ.get('MONGO_URL') or 'mongodb://localhost:27017/wyze-dev'
    return uri.split('/')[-1]
