from . import *
from ..app import app_auth
from ..services.auth import user_register, generate_auth_token
from ..services.users import add_invited_user, list_users, remove_user, set_user_property

blueprint = Blueprint('api_auth', __name__, url_prefix='/api/auth')


@blueprint.route('/login')
@app_auth.login_required
def get_token():
    token = generate_auth_token(g.user)
    return jsonify(token=token.decode('ascii'))


@blueprint.route('/register', methods=['POST'])
def register():
    invitation = request.form.get('invitation')
    email = request.form.get('email')
    password = request.form.get('password')
    try:
        assert invitation
        assert email
        assert password
        user_id = user_register(invitation, email, password)
        assert user_id
        return jsonify(status='ok')
    except Exception as e:
        return jsonify(status='error', result=e.__repr__())


@blueprint.route('/user/create', methods=['POST'])
@app_auth.login_required
def create_user():
    try:
        assert g.user.role == 'admin'
        res = add_invited_user(
            real_name=request.form.get('real_name', ''),
            role='admin' if request.form.get('admin', 0) else 'user'
        )
        assert res
    except Exception as e:
        return jsonify(states='error', result=e.__repr__())


@blueprint.route('/user/list', methods=['POST'])
@app_auth.login_required
def list_users():
    return jsonify(results=list_users())


@blueprint.route('/user/enable')
@app_auth.login_required
def toggle_user_enable():
    try:
        assert g.user.role == 'admin'
        res = set_user_property(
            request.args['id'],
            enabled=1 if request.args.get('value') else 0
        )
        assert res
    except Exception as e:
        return jsonify(states='error', result=e.__repr__())


@blueprint.route('/user/remove')
@app_auth.login_required
def remove_user():
    try:
        assert g.user.role == 'admin'
        assert remove_user(request.args['id'])
    except Exception as e:
        return jsonify(states='error', result=e.__repr__())
