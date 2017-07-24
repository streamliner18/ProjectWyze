from ..config.mongo_conf import list_raw_devices

global_mqtt_mappings = {
    'inputs': {}, 'outputs': {}
}


def generate_mappings():
    devices = list_raw_devices()
    inputs = {}
    outputs = {}
    for i in devices:
        device_id = i['device_id']
        device_name = i['name']
        in_key = i['input_key']
        out_key = i['output_key']
        for j in i['channels']:
            inputs['{}.{}.{}'.format(device_id, j['rule'], in_key)] = \
                '{}.{}'.format(device_name, j['alias'])
            if j['has_input']:
                outputs['{}.{}.output'.format(device_name, j['alias'])] = \
                    '{}.{}.{}'.format(device_id, j['rule'], out_key)
    return {
        'inputs': inputs,
        'outputs': outputs
    }


def init_mqtt_mappings():
    global global_mqtt_mappings
    global_mqtt_mappings.update(generate_mappings())
    print("Input mappings:")
    for k, v in global_mqtt_mappings['inputs'].items():
        print('- {} => {}'.format(k, v))
    print('Mappings loaded: {} inputs, {} outputs'.format(
        len(global_mqtt_mappings['inputs']),
        len(global_mqtt_mappings['outputs'])
    ))


def mqtt_transkey(key):
    return global_mqtt_mappings['inputs'][key]
