from . import *
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from bson.objectid import ObjectId


def user_register(invitation, email, password):
    users = app_mongo.db['users']
    invitation = users.find_one({
        "invite_id": invitation
    })
    if invitation and 'email' not in invitation:
        invitation['email'] = email
        invitation['pwhash'] = app_bcrypt.generate_password_hash(password)
        invitation['enabled'] = True
        del invitation['invite_id']
        users.replace_one({'_id': invitation['_id']}, invitation)
        return str(invitation['_id'])
    return None


def verify_auth_token(token):
    s = Serializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None  # valid token, but expired
    except BadSignature:
        return None  # invalid token
    user = app_mongo.db['users'].find_one(ObjectId(data['id']))
    return user


@app_auth.verify_password
def user_login(email_or_token, password):
    user = verify_auth_token(email_or_token)
    if not user:
        users = app_mongo.db['users']
        user = users.find_one({
            "email": email_or_token
        })
        if user and app_bcrypt.check_password_hash(user['pwhash'], password):
            g.user = user
            return True
        else:
            return False
    return True


def generate_auth_token(user_obj, expiration=600):
    s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
    return s.dumps({'id': str(user_obj['_id'])})

