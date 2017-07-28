from .processing import stamp_tag


exchanges = ['ingress', 'incoming', 'egress', 'outgoing']


route_mqtt_ingest = {
    'exchange': 'amq.topic',
    'routing_keys': '#'
}


def cb_mqtt_ingest(mapper, ch, method, prop, body):
    try:
        k = mapper.translate_in(method.routing_key)
        output = stamp_tag(body, k, prop)
        ch.basic_publish('ingress', k, output)
    except KeyError:
        pass
    except Exception as e:
        print("Dropping message, reason: {}".format(e.__repr__()))


route_amq_ingest = {
    'exchange': 'incoming',
    'routing_keys': '#'
}


def cb_amq_ingest(mapper, ch, method, prop, body):
    try:
        output = stamp_tag(body, method.routing_key, prop)
        ch.basic_publish('ingress', method.routing_key, output)
    except KeyError:
        pass
    except Exception as e:
        print("Dropping message, reason: {}".format(e.__repr__()))


route_amq_emit = {
    'exchange': 'outgoing',
    'routing_keys': '#'
}


def cb_amq_emit(mapper, ch, method, prop, body):
    try:
        output = stamp_tag(body, method.routing_key, prop)
        ch.basic_publish('egress', method.routing_key, output)
    except KeyError:
        pass
    except Exception as e:
        print("Dropping message, reason: {}".format(e.__repr__()))


route_mqtt_emit = {
    'exchange': 'outgoing',
    'routing_keys': '#'
}


def cb_mqtt_emit(mapper, ch, method, prop, body):
    try:
        k = mapper.translate_out(method.routing_key)
        ch.basic_publish('amq.topic', k, body)
    except KeyError:
        pass
    except Exception as e:
        print("Dropping message, reason: {}".format(e.__repr__()))


routes = {
    'mqtt_ingest': (route_mqtt_ingest, cb_mqtt_ingest),
    'amq_ingest': (route_amq_ingest, cb_amq_ingest),
    'mqtt_emit': (route_mqtt_emit, cb_mqtt_emit),
    'amq_emit': (route_amq_emit, cb_amq_emit)
}
