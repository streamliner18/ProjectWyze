# Developing and Hacking Project Wyze

## Close-up of the Three-tier architecture

### Router Tier

This tier of components handle ingestion of data. As the RabbitMQ broker exposes both `5672 (AMQP)` and `1883 (MQTT)` ports, you may connect any data sources to these ports or write up your own data feed that publishes to the queue, similar to `spouts` in Apache Storm. When constructing your route, publish to the exchange `ingress` to ensure reception.

The entire tier is integrated into one unified container, named `wyze-router`.

#### `mqtt-demux`: MQTT Demuxer

Your MQTT topics should follow a similar format:

```
base-network/b5ea3f/device3/subtopic1A/status
~~~~~~~~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~
^Device ID                  ^Subtopic  ^Type
```

You may set up mappings from a physical Device ID to a logical device name or route, subtopic translations and data type interpretations all with the management console. If you target key is a partial route, use RabbitMQ splitter format `.` instead of the MQTT `/`.

For example, with the following pseudo-config:

```ini
[Device]
"mesh/b5ea3f/42" = "bedroom.light"

[Subtopic]
"M" = "brightness"

[Types]
input = status
output = command
```

An ingress message `[mesh/b5ea3f/42/M/status] 255` will enter the system as `[bedroom.light.brightness] 255`. Similarly, an egress message turning off the light `[bedroom.light.brightness.output] {"value": 0}` will be sent to the MQTT broker as `[mesh/b5ea3f/42/M/command] {"value":0}`.

Note that if you decide to send command to a device **directly** using MQTT, the command will NOT be parsed by the demuxer and instead will be handled **solely by the MQTT broker**, i.e. picked up only by MQTT devices that wishes to receive it. This is to prevent repetition of the message, as it will be parsed back as a duplicate command after going through the pipelines. If your intention is to have the message documented, use a separate log topic and declare that as a channel in your template.

#### `pre-processor`: Preprocessor

The preprocessor does four things to the incoming message:

1. It wraps any non-JSON body with a "value" tag. `25` -> `{"value": "25"}
2. It stamps a UUID to the message so it can be identified.
3. It stamps the RabbitMQ message timestamp into the message body.
4. It stamps the topic of that message into the message body.

### Data Tier

The Data Tier is the heart of the system. Let's go through the data storages first.

#### `mongo-db`: MongoDB General storage

The MongoDB is directly tied to the management console and all other configurable components of the system, including the aforementioned demuxing directives. The database also stores custom Python codes and their trigger keys from the 

#### `kafka-mq`: Kafka Message Queue

The main datastream distribution & archival center. Kafka is a message queue loaded onto a reel-to-reel tape recorder, as an input stream can be played out at near real-time, as well as stored on the tape for a random-access playback. This is extremely handy for the data processing system, as 

Two streams are housed within the Kafka queues, `raw-stream` and `processed-stream`. Topic keys are carried over for a consistent trigger/indexing performance. `Twisted` non-blocking lib is used to in order to provide the maximum concurrent throughput.

#### `postgres-db`: A tentative Plan B for testing

This might not be build after all if the road to `kafka` is well-paved. The database gives a much more trivial workflow for lookback support and robust indexing capabilities. Should the `kafka` solution not work, the stream will be completely split to ephemoral real-time data with RabbitMQ, and persistent playback data stored into this base.

#### `wyze-engine`: Processing Engine

The Processing Engine churns through input data and generates an output stream into the `processed` queue of Kafka. Optionally, it can also pass through parts of the raw stream per the configuration.

The engine is configured one-off at startup. During the startup process, it binds the output exchange to the input exchange based on the passthrough keys. It then loads all user-configured Python scripts from the MongoDB and evaluates them as such:

1. Compiles the scripts and executes them in a pseudo-context. If the execution fails, flag the script invalid.
2. Tests the namespace to verify that required functions are defined.

For all scripts that have passed the test, open one thread per script with a pre-binded subscription using the routing key along with the script.

As the raw info queue is a durable one, the processing engine can scale and fail. When the configuration is changed, reloading is done by restrating the engine.

