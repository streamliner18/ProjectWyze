# Project Wyze

Project Wyze is a general-purpose data exchange and processing system intended for transporting large amounts of streaming data through an entirely programmable pipeline, and providing endpoints to stream the processed data out at real-time, as well as capabilities to playback the timeline like a YouTube livestream.

## Credits

Project Wyze is a collective effort of Jimmy He and Sasan Erfan at the University of Illinois at Urbana-Champaign.

Project Wyze is powered by RabbitMQ and Apache Kafka. The architecture draws inspirations from [Apache Storm](http://storm.apache.org), [Apache Spark](https://spark.apache.org), and is partially derived from Jimmy He's [patent](https://www.google.com/patents/CN104239505B?cl=en) (CN 104239505 B) as well as Ricequant's Open Source [RQAlpha financial backtest engine](https://github.com/ricequant/rqalpha).

Special thanks to Ethan Luo Yicheng at Imperial College London, Professor Christopher D. Schmitz at the University of Illinois at Urbana-Champaign and Yichi Zhang at Wuhan University for support and inspirations.

## Plug-n-Play

Deploying Project Wyze for your day-to-day amusement is simple:

```bash
docker-compose up
```

It opens up a MQTT endpoint at 1883, a RabbitMQ console at 15672, a RabbitMQ endpoint at 5672, an output streaming endpoint at 5080, and a management console at 5081.

Refer to the [Deployment Guide](docs/deploy.md) for instructions on deploying in a production environment.

## Architecture

Project Wyze is a collection of Docker containers orchestrated via `docker-compose` and coordinated with a central RabbitMQ broker, which doubles as a MQTT broker. It is intended and encouraged that different parts be bypassed or replaced to suit a particular use case as long as the pipeline is integral.

Wyze is a three-tier system. The **Ingress Tier** handles data ingestion and preprocessing, as well as demuxing MQTT messages to offload certain processing from low-power IoT appliances. The **Data Tier** stores and processes the data per the configurations. Processed data remains its streaming properties by residing both in a playback-able Kafka queue and a RabbitMQ queue for more real-time streaming performance. Finally, the **Egress Tier** handles client-side subscription of real-time streaming data and serves data back in the timeline according to playback requests. Independent of the three tiers but also a part of the system, a **Management Console** is provided for configuring the system and coding up processing directives in Python scripts. For detailed information about each component, refer to the [development guide](docs/develop.md).

## Contributing to Project Wyze

[Contribution Guide](docs/contribute.md) is coming soon. We highly recommend reading through the guide before making a contribution, as improperly constructed commits and/or pull requests will be pitifully rejected.

We also welcome bug reports and feature suggestions from the `Issues` section.