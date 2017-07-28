from ..config.mongo_conf import list_raw_devices


class MQTTMapper:
    def __init__(self):
        self.mappings = {
            'inputs': {}, 'outputs': {}
        }

    @staticmethod
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

    def begin(self):
        self.mappings.update(self.generate_mappings())
        print("Input mappings:")
        for k, v in self.mappings['inputs'].items():
            print('- {} => {}'.format(k, v))
        print('Mappings loaded: {} inputs, {} outputs'.format(
            len(self.mappings['inputs']),
            len(self.mappings['outputs'])
        ))

    def translate_in(self, key):
        return self.mappings['inputs'][key]

    def translate_out(self, key):
        return self.mappings['outputs'][key]
