from flask_script import Manager
from app.app import app
from app.services import seeds

manager = Manager(app)


@manager.command
def init():
    print('Initializing database. The old db will be wiped.')
    seeds.build_database()
    seeds.initial_database_seed()
    print('Init complete. Create admin account using invitation ID "root"')


if __name__ == "__main__":
    manager.run()
