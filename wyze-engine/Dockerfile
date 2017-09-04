FROM continuumio/anaconda3

MAINTAINER Project Wyze Team

ENV BUILD_DIR=/tmp/build/
ENV APP_DIR=/var/app
ENV CONDA=/opt/conda/bin/conda
ENV PIP=/opt/conda/bin/pip

RUN apt install -y supervisor

COPY conf/requirements.txt $BUILD_DIR
COPY conf/conda_req.txt $BUILD_DIR

RUN conda install -y --file $BUILD_DIR/conda_req.txt
RUN pip install -r $BUILD_DIR/requirements.txt
# RUN PATH=/opt/conda/bin conda install -y --file $BUILD_DIR/conda_req.txt
# RUN PATH=/opt/conda/bin pip install -r $BUILD_DIR/requirements.txt

COPY conf/supervisord.conf /etc/
COPY src $APP_DIR

CMD ["/usr/bin/supervisord"]