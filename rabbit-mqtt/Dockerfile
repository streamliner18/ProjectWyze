FROM rabbitmq:latest

MAINTAINER Project Wyze Team

RUN rabbitmq-plugins enable --offline rabbitmq_management
RUN rabbitmq-plugins enable --offline rabbitmq_mqtt

EXPOSE 15672
EXPOSE 1883
