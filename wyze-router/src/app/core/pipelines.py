from app.core.routes import exchanges, routes


def setup_exchanges(ch):
    for i in exchanges:
        ch.exchange_declare(
            exchange=i,
            exchange_type='topic',
            durable=True
        )
    ch.exchange_bind('egress', 'ingress', '#')


def setup_routes(ch):
    bindings = {}
    print('Setting up {} routes...'.format(len(routes)))
    for k, (v, f) in routes.items():
        q = ch.queue_declare(
            auto_delete=True,
            queue='wyze-internal.' + k
        ).method.queue
        for i in v['routing_keys']:
            ch.queue_bind(
                queue=q,
                exchange=v['exchange'],
                routing_key=i
            )
        bindings[k] = {
            'queue': q,
            'callback': f
        }
    print('{} routes wired up.'.format(len(bindings)))
    return bindings
