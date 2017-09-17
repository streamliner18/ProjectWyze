FROM rabbitmq:3.6.11

MAINTAINER Project Wyze Team

COPY rabbitmq_message_timestamp.ez /usr/lib/rabbitmq/lib/rabbitmq_server-3.6.11/plugins/

COPY rabbitmq.config /etc/rabbitmq/
COPY definitions.json /etc/rabbitmq/

RUN chmod +r /etc/rabbitmq/rabbitmq.config

RUN rabbitmq-plugins enable --offline rabbitmq_management
RUN rabbitmq-plugins enable --offline rabbitmq_mqtt
RUN rabbitmq-plugins enable --offline rabbitmq_message_timestamp

ENV RABBITMQ_HIPE_COMPILE 1

EXPOSE 15672
EXPOSE 1883
