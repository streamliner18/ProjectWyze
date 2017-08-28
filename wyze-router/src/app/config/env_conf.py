from os import environ
from multiprocessing import cpu_count


def get_broker_address():
    return environ.get('BROKER_ADDRESS') or 'localhost'


def get_mongo_address():
    return environ.get('MONGO_URL') or 'mongodb://localhost:27017/wyze-dev'


def get_redis_address():
    return environ.get('REDIS_ADDRESS') or 'localhost'


def get_n_of_threads():
    return int(environ.get('THREADS')) or cpu_count()
