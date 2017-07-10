from .app import app
from flask import render_template
from .api import mq_devices, auth

app.register_blueprint(mq_devices.blueprint)
app.register_blueprint(auth.blueprint)


@app.route('/')
@app.route('/<path:path>')
def hello_world(**kwargs):
    return render_template('index.html')