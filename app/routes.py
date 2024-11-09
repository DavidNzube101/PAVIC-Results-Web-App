import ast
import random
from uuid import uuid4

from app.utils import id_generator
from .db.db import dbORM
from .db import encrypt
from flask_login import LoginManager, login_required, logout_user, current_user, login_user, UserMixin
from flask import render_template, Blueprint, request, jsonify, redirect
from .utils.function_pool import getUserData, template_payload, isFound, decryptDataType


routes = Blueprint('routes', __name__)

@routes.route("/")
def showLandingPage():
    
    return render_template("index.html")
    
@login_required
@routes.route("/dashboard")
def showDashboard():
    
    payload = template_payload()
    
    payload['currentUser'] = getUserData(model="UserPSCM", column=current_user.id)
    payload['currentScreen'] = random.choice(["1", "2", "3", "4"])
    allTR = dbORM.find_all("ResultPSCM", "teacher_id", getUserData(model="UserPSCM", column=current_user.id)['teacher_id'])
    payload['allTeacherResults'] = allTR
    
    payload['decryptDataType'] = decryptDataType
    
    
    return render_template("dashboard.html", **payload)

@routes.route("/api/add-results", methods=["POST"])
@login_required
def add_results():
    data = request.json
    
    currentUser = getUserData(model="UserPSCM", column=current_user.id)
    
    new_result = {
        "student_name": data['studentName'],
        "student_class": data['class'],
        "subject": encrypt.encrypter(str(data['subjects'])),
        "teacher_id": currentUser['teacher_id'],
        "remark": data['teacherRemark'],
        "results_id": id_generator.generate_id(10)
    }
    dbORM.add_entry("ResultPSCM", encrypt.encrypter(str(new_result)))
    
    return jsonify({"success": True, "id": str(uuid4())})

@routes.route("/davidnzube")
def redirectToDeveloperWebsite():
    return redirect("https://davidnzube.vercel.app")

@routes.route("/results/<result_id>")
def view_shared_result(result_id):

    payload = template_payload()
    
    try:
        currentUser = getUserData(model="UserPSCM", column=current_user.id)    
        payload['currentUser'] = currentUser
    except:
        pass
        payload['isUserAuth'] = "False"    
    
    
    results = dbORM.get_all("ResultPSCM")[isFound("ResultPSCM", "results_id", result_id)]
    
    payload['theResult'] = results
    # teacher = 
    payload['teacher'] = dbORM.get_all("UserPSCM")[isFound("UserPSCM", 'teacher_id', results['teacher_id'])]
    payload['decryptDataType'] = decryptDataType
    
    
    return render_template("result-page.html", result_id=result_id, **payload)


