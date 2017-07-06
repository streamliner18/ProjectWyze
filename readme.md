# Project Wyze

Project Wyze is a general-purpose data exchange and processing system intended for transporting large amounts of streaming data through an entirely programmable pipeline, and providing endpoints to stream the processed data out at real-time, as well as capabilities to playback the timeline like a YouTube livestream.

## Credits

Project Wyze is a collective effort of Jimmy He and Sasan Erfan at the University of Illinois at Urbana-Champaign.

Project Wyze is powered by RabbitMQ and Apache Kafka. The architecture draws inspirations from [Apache Storm](http://storm.apache.org), [Apache Spark](https://spark.apache.org), and is partially derived from Jimmy He's [patent](https://www.google.com/patents/CN104239505B?cl=en) (CN 104239505 B) as well as Ricequant's Open Source [RQAlpha financial backtest engine](https://github.com/ricequant/rqalpha).

Special thanks to Ethan Luo Yicheng at Imperial College London and Professor Christopher D. Schmitz at the University of Illinois at Urbana-Champaign for support and inspirations.

## Plug-n-Play

Deploying Project Wyze for your day-to-day amusement is simple:

```bash
docker-compose up
```

It opens up a MQTT endpoint at 1883, a RabbitMQ console at 15672, a RabbitMQ endpoint at 5672, an output streaming endpoint at 5080, and a management console at 5081.

Refer to the [Deployment Guide](docs/deploy.md) for instructions on deploying in a production environment.

## Architecture

Coming soon. For more information, refer to the [contribution guide](docs/contribute.md). (Also coming soon XD)
