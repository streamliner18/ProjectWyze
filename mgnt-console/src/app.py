from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_pymongo import PyMongo

app = Flask(__name__)
app_bcrypt = Bcrypt(app)
app_login = LoginManager()
app_mongo = PyMongo(app)

app_login.init_app(app)