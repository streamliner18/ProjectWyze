import paho.mqtt.client as mqtt
from os import environ
from time import sleep
from random import randint

address = environ.get('BROKER_ADDRESS', 'localhost')

rolling = True

client = mqtt.Client()


def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe('test/mqtt-dice/ROLL/command')


def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


def setup_client():

    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(address, 1883, 60)
    client.loop_start()


def roll_dice():
    result = randint(1, 6)
    client.publish('test/mqtt-dice/RES/status', str(result))


if __name__ == '__main__':
    try:
        setup_client()
        while True:
            if rolling:
                roll_dice()
                sleep(1)
    except KeyboardInterrupt:
        client.loop_stop()