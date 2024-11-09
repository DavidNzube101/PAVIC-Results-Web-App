from .db.db import dbORM
from .utils.function_pool import isFound as db_find_one
from .utils.function_pool import template_payload
from flask import render_template, Blueprint, request, redirect, url_for
from flask_login import LoginManager, login_required, logout_user, current_user, login_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

authentication = Blueprint('authentication', __name__)
auth = authentication

@auth.route("/login", methods=['POST', 'GET'])
def showLoginPage():
    payload = template_payload()
    
    try:
        payload['loginError'] = ""
        if request.method == 'POST':
            email = request.form['email']
            password = request.form['password']
            
            isEmail = db_find_one("UserPSCM", 'email', email)
            
            if isEmail and check_password_hash(dbORM.get_all("UserPSCM")[isEmail]['password'], password):
                from .hooks.Auth import UserClass
                
                t_user = UserClass(id=f'{isEmail}')
                login_user(t_user, remember=True)
                return redirect(url_for("routes.showDashboard"))
            else:
                payload['loginError'] = "Login credentials is not correct"
                return render_template("login.html", **payload)
                    
                
            
        return render_template("login.html", **payload)
    except Exception as e:
        payload['loginError'] = "Something went wrong, try again later."
        print("Error-> ", e)
        return render_template("login.html", **payload)

@login_required
@auth.route('/logout')
def logOutUser():
    logout_user()
    return redirect(url_for("authentication.showLoginPage"))