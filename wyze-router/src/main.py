from app.router import Router
from app.amq.mqtt_map import init_mqtt_mappings


if __name__ == '__main__':
    init_mqtt_mappings()
    router = Router()
    router.run()