# Project Wyze

**Project Wyze** is the Segway of real-time data processing with the power of a Ferrari. It lets you focus on what you **want** to do with the **data itself**, and forget about scheduling, managing the stream and handling failures. Write minimal code and enjoy instant gratification with a convenience you could only find on custom-built proprietary systems, while having freedom of customizing all you want.

Named after [Principality of Wy](http://principalityofwy.com/), Project Wyze is an intuitive *un-framework*. Stream in the data, and you can both process the current data and *look back* with one call (coming soon). Design your own visualizations and playback your analytics on a timeline like a YouTube livestream (coming soon). It is also a polyglot supporting both AMQP and MQTT endpoints. 

Project Wyze is designed for **everyone** doing Internet of Things, Remote Monitoring, Quantitative Trading, and everything involving Streaming Analytics in general.

## Credits

Project Wyze is a collective effort of Jimmy He (@streamliner18) and Sasan Erfan (@sasma) at the University of Illinois at Urbana-Champaign.

Project Wyze is powered by RabbitMQ, MongoDB and Redis. The architecture draws inspirations from [Apache Storm](http://storm.apache.org), [Apache Spark](https://spark.apache.org), and is partially derived from Jimmy He's [patent](https://www.google.com/patents/CN104239505B?cl=en) (CN 104239505 B) as well as Ricequant's Open Source [RQAlpha financial backtest engine](https://github.com/ricequant/rqalpha).

Also, special thanks to these friends for support and inspirations: 

- **(Ethan) Luo Yicheng** (@ethanluoyc) M.Eng CS, Imperial College London
- **Professor Christopher D. Schmitz** (@cdschmit), ECE @ University of Illinois at Urbana-Champaign
- **Yichi Zhang** B.E. Financial Engineering, Wuhan University
- **Bo Ma** former Tech Coach, Baidu Inc

## Plug-n-Play

Deploying Project Wyze for your day-to-day amusement is simple. Download the latest release and just run:

```bash
docker-compose up
```

It opens up a MQTT endpoint at 1883, a RabbitMQ console at 15672, a RabbitMQ endpoint at 5672, an output streaming endpoint at 5080, and a management console at 5081.

Under each component's folder, you may also find a `utils` section, where we provide useful tools that we use to test individual components, run sample workloads, and cut corners in our workflow (yes!), so that you can do so as well (You're welcome. \<3)

Refer to the [Deployment Guide](docs/deploy.md) for instructions on deploying a modified codebase or in a production environment. Trust me, that's way simpler than you think it is.

## Architecture

Project Wyze is a collection of Docker containers orchestrated via `docker-compose` and coordinated with a central RabbitMQ broker, which doubles as a MQTT broker. It is intended and encouraged that different parts be bypassed or replaced to suit a particular use case as long as the pipeline is integral.

This is done by having a single data backbone (i.e. RabbitMQ) containing a pool of messages classified by their "topic". Processing of these messages takes form of picking one up by its topic, and emitting a **separate message** into the pool, preferably in a different topic string. The original message stays unchanged and you can still use it for other purposes.

The data backbone of Project Wyze is a 3-tier abstraction atop AMQP's exchange models. The **Ingress Tier** handles data ingestion and preprocessing, as well as demuxing MQTT messages to offload certain processing from low-power IoT appliances. The **Data Tier** stores and processes the data per the configurations. Processed data remains its streaming properties by residing both in a playback-able Kafka queue and a RabbitMQ queue for more real-time streaming performance. Finally, the **Egress Tier** handles client-side subscription of real-time streaming data and serves data back in the timeline according to playback requests. 

This repository ships three decent components powering this data backbone, but you're always free to add or replace them with your own components. Here are the standard parts:

### Router

As the name suggests, the Router is the gateway to both Ingress and Egress tiers, as well as the heavy lifter that routes traffic from one tier to another, or into a persistence module. More specifically, it helps demux MQTT messages, modifies incoming messages to fit a standard specification (stamps the key and time received, assign an ID, etc). It also helps store every messege into Redis for lookback processing and MongoDB for permanent storage. 

Every such action is abstracted into a **Route**. You can always add more routes to achieve different functionality. Routes are compiled and you cannot add them on the fly. All routes are executed in parallel, potentially speeding up the process. To scale further, you can even run the Router multithreaded or even on multiple machines.

### Engine

The engine handles **user-defined data processing workloads**, which are called **Lambdas**. They are Python scripts stored in the database, with an entry point formatted as `def handle_input(context, msg)`. Users may determine to which topics of messages the lambda triggers, error behaviors and whether it can run multithreaded. Lambda  scripts may also leverage the `context`, which provides a set of tools managed by the engine to perform stateful operations, look back to the history of the message and emitting output messages.

### Console

A **Management Console** is provided for configuring the system, defining MQTT devices, and coding up the said Lamdas with its built-in web-based IDE. The console will be crucial in further revisions, being an IDE tailored to debugging lambdas, and analyzing lambda performance and system activity.


For detailed view on each of these components, refer to the [development guide](docs/develop.md).


## Contributing to Project Wyze

[Contribution Guide](docs/contribute.md) is coming soon. We highly recommend reading through the guide before making a contribution, as improperly constructed commits and/or pull requests will be pitifully rejected.

We also welcome bug reports and feature suggestions from the `Issues` section.
