from . import *
from ..app import app_auth
from ..services.mqtemplates import list_mqtemplates, update_mqtemplate, get_mqtemplate, update_mqdevices, delete_mqtemplate

blueprint = Blueprint('api_mqtemplates', __name__, url_prefix='/api/mqtemplates')


@blueprint.route('/list')
@app_auth.login_required
def list_templates():
    return jsonify(
        status='ok',
        result=list_mqtemplates()
    )


@blueprint.route('/<_id>')
@app_auth.login_required
def get_template(_id):
    template = get_mqtemplate(_id)
    if template:
        return jsonify(
            status='ok',
            result=template
        )
    abort(404)


@blueprint.route('/update', methods=['POST'])
@app_auth.login_required
def update_template():
    print('Logged in template: {}'.format(g.user))
    data = request.json
    update_mqtemplate(data, g.user['_id'])
    return jsonify(
        status='ok'
    )


@blueprint.route('/<_id>/delete')
@app_auth.login_required
def delete_templates(_id):
    delete_mqtemplate(_id)
    return jsonify(
        status='ok'
    )


@blueprint.route('<_id>/update_devices')
@app_auth.login_required
def update_template_devices(_id):
    update_mqdevices(_id)
    return jsonify(
        status='ok'
    )