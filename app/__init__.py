from flask import Flask, render_template
from flask_login import LoginManager, login_required, logout_user, current_user, login_user, UserMixin
from .hooks import Auth
from .db.db import dbORM


def initialize_app():
    
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'sdadsadakmi23e'
    
    
    
    from .routes import routes
    from .authentication import authentication
    
    app.register_blueprint(routes, url_prefix='/')
    app.register_blueprint(authentication, url_prefix='/')
    
    @app.errorhandler(500)
    def internal_server_error(e, err_code=500):
        app.logger.error(f"Internal Server Error: {e}")
        return render_template('server-error.html', error=e, code=err_code), 500

    @app.errorhandler(404)
    def route_not_found(e, err_code=404):
        app.logger.error(f"Route Not Found: {e}")
        return render_template('page-not-found.html', error=e, code=err_code), 404
    
    FL_Login = LoginManager(app)
    FL_Login.login_view = 'login'

    @FL_Login.user_loader
    def load_user(id):
        try:
            u = dbORM.find_one("User", "id", id)
            if not u:
                return None
            return Auth.UserClass(id=dbORM.get_all("User")[f'{u}']['id'])
        except:
            anonymous = {
                "0": {
                    "id": "0", 
                    "email": "NULL"
                }
            }
            return Auth.UserClass(id=anonymous['0']['id'])



    
    return app