FROM jamiehewland/alpine-pypy

MAINTAINER Project Wyze Team

ENV BUILD_DIR=/tmp/build/
ENV APP_DIR=/var/app

RUN apk update && apk add supervisor

COPY conf/requirements.txt $BUILD_DIR
RUN pip3 install -r $BUILD_DIR/requirements.txt

COPY conf/supervisord.conf /etc/
COPY src $APP_DIR

CMD ["/usr/bin/supervisord"]