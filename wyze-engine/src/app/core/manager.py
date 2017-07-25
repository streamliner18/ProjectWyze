from ..drivers.amq import ch


def start():
    ch.start_consuming()


def stop():
    ch.stop_consuming()
