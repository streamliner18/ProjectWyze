from app.core.manager import EngineManager


def main():
    manager = EngineManager()
    print('[MAIN] Wyze Engine is starting up...')
    try:
        manager.run()
    except KeyboardInterrupt:
        print('[MAIN] Packing up and going home...')
        manager.terminate()


if __name__ == '__main__':
    main()