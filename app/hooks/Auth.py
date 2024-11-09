from flask_login import LoginManager, login_required, logout_user, current_user, login_user, UserMixin
from ..db.db import dbORM

class UserClass:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def is_authenticated():
        return True

    @staticmethod
    def is_active():
        return True

    @staticmethod
    def is_anonymous():
        return False

    def get_id(self):
        return self.id

