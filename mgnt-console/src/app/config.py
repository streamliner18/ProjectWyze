class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = b'\x98\xfd\x8e\xbc\xd54\xb9\xfa\xffM\x11v\x9b\x01\xe5\xf2:\xd8\x08%\x87&\x0b\x11'


class ProductionConfig(Config):
    MONGO_URI = 'mongodb://mongo:27017/wyze'


class DevelopmentConfig(Config):
    DEBUG = True
    MONGO_URI = 'mongodb://localhost:27017/wyze-dev'


class TestingConfig(Config):
    TESTING = True
    MONGO_URI = 'mongodb://localhost:27017/wyze-test'