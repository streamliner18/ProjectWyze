from app.core.subprocess import LambdaProcess


test_subprocess_data = {
    'name': 'Test Lambda',
    'code': """
def init(context):
    print("Initializing context")
    context.set_state('counter', 1)
def handle_input(msg, context):
    # print("Got Message:")
    # print(msg)
    counter = context.get_state('counter')
    context.set_state('counter', counter+1)
    # print('New Counter: {}'.format(counter+1))
    context.emit('logs.output', '123')
    """,
    'durable': True,
    'recursive': True,
    'workers': 1,
    'bindings': ['logs.#']
}


if __name__ == '__main__':
    p = LambdaProcess(test_subprocess_data)
    try:
        p.start()
        p.join()
    except KeyboardInterrupt:
        print('Terminated.')
    finally:
        p.terminate()
