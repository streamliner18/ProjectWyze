from app import app
from config import DevelopmentConfig
from flask import render_template
from api import mqdevices


@app.route('/')
@app.route('/<path:path>')
def hello_world(**kwargs):
    return render_template('index.html')


app.register_blueprint(mqdevices.blueprint)


if __name__ == '__main__':
    app.config.from_object(DevelopmentConfig)
    app.run()
