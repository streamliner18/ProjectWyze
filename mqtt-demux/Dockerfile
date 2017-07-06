FROM skiftcreative/supervisor

MAINTAINER Project Wyze Team

ENV BUILD_DIR=/tmp/build/
ENV APP_DIR=/var/app

COPY requirements.txt $BUILD_DIR
RUN pip3 install -r $BUILD_DIR/requirements.txt -i https://pypi.douban.com/simple

COPY supervisor-conf/* /etc/supervisor/conf.d/
COPY src $APP_DIR
