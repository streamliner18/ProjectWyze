from .amq import ch


def amq_init_rc():
    ch.exchange_declare(
        'wyze_internal',
        exchange_type='topic',
        durable=False
    )
    cons_queue = ch.queue_declare(exclusive=True)
    ch.queue_bind(cons_queue.method.queue, 'wyze_internal', 'ctrl.engine.#')
