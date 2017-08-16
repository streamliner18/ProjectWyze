from . import *
from ..app import app_auth
from requests import get
from simplejson import loads
from ..services.remote import get_broker_address
from ..services.lambdas import count_lambda_load, count_lambdas
from ..services.mqdevices import count_mqchannels

blueprint = Blueprint('api_stats', __name__, url_prefix='/api/stats')
broker_address = 'http://' + get_broker_address() + ':15672'


@blueprint.route('/ticks')
def stat_ticks():
    data = loads(get(broker_address + '/api/overview', auth=('guest', 'guest')).content)
    result = data['message_stats']
    for i in result.keys():
        if i.rfind('_details') > 0:
            result[i[:i.rfind('_details')]] = result[i]['rate']
    return jsonify(
        status='ok',
        result=result
    )


@blueprint.route('/overview')
def stat_overview():
    result = {
        'mqtt': count_mqchannels(),
        'lambdas': count_lambdas(),
        'load': count_lambda_load()
    }
    return jsonify(
        result=result,
        status='ok'
    )
