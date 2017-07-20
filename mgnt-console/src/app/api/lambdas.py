from . import *
from ..app import app_auth
from ..services.lambdas import add_lambda, update_lambda, get_lambda, list_lambdas, delete_lambda

blueprint = Blueprint('api_lambdas', __name__, url_prefix='/api/lambdas')


@blueprint.route('/add')
@app_auth.login_required
def lambda_add():
    print(g)
    _id = add_lambda(g.user['_id'])
    return jsonify(
        status='ok',
        result=_id
    )


@blueprint.route('/update', methods=['POST'])
@app_auth.login_required
def lambda_update():
    data = request.json
    update_lambda(data)
    return jsonify(
        status='ok'
    )


@blueprint.route('/<_id>')
@app_auth.login_required
def lambda_get(_id):
    data = get_lambda(_id)
    if data:
        return jsonify(
            status='ok',
            result=data
        )
    abort(404)


@blueprint.route('/<_id>/delete')
@app_auth.login_required
def lambda_delete(_id):
    delete_lambda(_id)
    return jsonify(
        status='ok'
    )


@blueprint.route('/list')
@app_auth.login_required
def lambda_list():
    return jsonify(
        status='ok',
        result=list_lambdas()
    )