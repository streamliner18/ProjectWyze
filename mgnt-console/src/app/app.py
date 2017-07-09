from flask import Flask
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from flask_httpauth import HTTPBasicAuth
from os import environ

from .config import DevelopmentConfig, ProductionConfig, TestingConfig

app = Flask(__name__)

if environ.get('PRODUCTION'):
    app.config.from_object(ProductionConfig)
    print("Using production config.")
elif environ.get('TESTING'):
    app.config.from_object(TestingConfig)
    print("Using testing config.")
else:
    app.config.from_object(DevelopmentConfig)
    print("Using development config.")

app_bcrypt = Bcrypt(app)
app_mongo = PyMongo(app)
app_auth = HTTPBasicAuth()