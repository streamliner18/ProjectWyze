from flask import Flask, render_template
from api import mqdevices

app = Flask(__name__)


@app.route('/')
@app.route('/<path:path>')
def hello_world(**kwargs):
    return render_template('index.html')


app.register_blueprint(mqdevices.blueprint)


if __name__ == '__main__':
    app.run(debug=True)
