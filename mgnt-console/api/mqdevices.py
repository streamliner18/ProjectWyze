from . import *

blueprint = Blueprint('api_mqdevices', __name__, url_prefix='/api/mqdevices')


@blueprint.route('/list')
def list_devices():
    return jsonify(
        status='ok',
        devices=[1, 2, 3]
    )