from app.core.manager import start, stop

if __name__ == '__main__':
    try:
        print('Wyze Engine is starting.')
        start()
    except KeyboardInterrupt:
        stop()
