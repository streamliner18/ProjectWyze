from . import *
from ..app import app_auth
from ..services.mqdevices import update_mqdevice, list_mqdevices, get_mqdevice, delete_mqdevice
from ..services.mqtemplates import list_mqtemplates

blueprint = Blueprint('api_mqdevices', __name__, url_prefix='/api/mqdevices')


@blueprint.route('/list')
@app_auth.login_required
def list_devices():
    mqtemplates = list_mqtemplates()
    mqtemplates = {i['_id']: i for i in mqtemplates}
    return jsonify(
        status='ok',
        result=list_mqdevices(),
        templates=mqtemplates
    )


@blueprint.route('/<_id>')
@app_auth.login_required
def get_device(_id):
    device = get_mqdevice(_id)
    if device:
        return jsonify(
            status='ok',
            result=device
        )
    abort(404)


@blueprint.route('/update', methods=['POST'])
@app_auth.login_required
def update_device():
    print('Logged in device: {}'.format(g.user))
    data = request.json
    update_mqdevice(data, g.user['_id'])
    return jsonify(
        status='ok'
    )


@blueprint.route('/<_id>/delete')
@app_auth.login_required
def delete_devices(_id):
    delete_mqdevice(_id)
    return jsonify(
        status='ok'
    )
