from app.amq.pipelines import setup_pipelines
from app.amq.driver import ch
from app.amq.mqtt_map import init_mqtt_mappings


if __name__ == '__main__':
    print("Configuring RabbitMQ connection...")
    setup_pipelines()
    print("Configuring Premap mappings...")
    init_mqtt_mappings()
    print("Configuration complete. Now Starting.")
    # Start the thing
    ch.start_consuming()
