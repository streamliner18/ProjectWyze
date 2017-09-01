FROM skiftcreative/supervisor

MAINTAINER Project Wyze Team

ENV BUILD_DIR /tmp/build/
ENV APP_DIR /var/app
ENV PRODUCTION=1

RUN apk update && apk add --update alpine-sdk libffi-dev

COPY src $APP_DIR

COPY conf/requirements.txt $BUILD_DIR
RUN pip3 install -r $BUILD_DIR/requirements.txt

COPY conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]