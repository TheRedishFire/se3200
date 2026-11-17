from flask import Flask, request, jsonify, abort, render_template
from db_interface import CarDatabase
import auth



app = Flask(__name__)
DATABASE = 'cars.db'
db_manager = CarDatabase(DATABASE)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/cars', methods=['GET'])
@auth.login_required
def list_cars():
    return jsonify(db_manager.get_all()), 200

@app.route('/cars/<int:car_id>', methods=['GET'])
def get_car(car_id):
    car = db_manager.get_one(car_id)
    if car is None:
        abort(404)
    return jsonify(car), 200

@app.route('/cars', methods=['POST'])
def create_car():
    data = request.get_json()
    

    required = ['make', 'model', 'year', 'price']
    if not data or not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 422
    
    new_car = db_manager.create(data)
    
    resp = jsonify(new_car)
    resp.headers['Location'] = f"/cars/{new_car['id']}"  
    return resp, 201

@app.route('/cars/<int:car_id>', methods=['PUT']) # Fixed path
def update_car(car_id):
    data = request.get_json()
    updated_car = db_manager.update(car_id, data)
    
    if updated_car is None:
        abort(404)
        
    return jsonify(updated_car), 200

@app.route('/cars/<int:car_id>', methods=['DELETE']) # Fixed path and parameter
def delete_car(car_id):
    success = db_manager.delete(car_id)
    if not success:
        abort(404)
    return jsonify({"message": "deleted"}), 200

@app.route("/sessions", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = db_manager.get_user_by_email(email)
    if user is None or not auth.verify_password(password, user["password_hash"]):
        return jsonify({"error": "Invalid email or password"}), 401

    sid = auth.start_session(user["id"])
    resp = jsonify({
        "id": user["id"], "first_name": user["first_name"],
        "last_name": user["last_name"], "email": user["email"],
    })
    resp.set_cookie(
        auth.SESSION_COOKIE, sid,
        httponly=True, samesite="Lax", path="/", max_age=auth.SESSION_MAX_AGE,
    )
    return resp, 200


@app.route("/sessions", methods=["DELETE"])
def logout():
    auth.end_session(request.cookies.get(auth.SESSION_COOKIE))
    resp = jsonify({"message": "logged out"})
    resp.delete_cookie(auth.SESSION_COOKIE, path="/")
    return resp, 200


@app.route("/sessions/current", methods=["GET"])
@auth.login_required
def current_session():
    return jsonify(db_manager.get_user(auth.current_user_id())), 200

@app.route("/users", methods=["POST"])
def register_user():
    data = request.get_json(silent=True) or {}
    required = ("first_name", "last_name", "email", "password")
    if not all(data.get(k) for k in required):
        return jsonify({"error": "Missing required fields"}), 422

    email = data["email"].strip().lower()
    if db_manager.get_user_by_email(email) is not None:
        return jsonify({"error": "That email is already registered"}), 409

    pw_hash = auth.hash_password(data["password"])
    user = db_manager.create_user(
        data["first_name"], data["last_name"], email, pw_hash
    )
    if user is None:                                  # race: unique violation
        return jsonify({"error": "That email is already registered"}), 409

    resp = jsonify(user)
    resp.headers["Location"] = f"/users/{user['id']}"
    return resp, 201



@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:5000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed for this route"}), 405

if __name__ == '__main__':
    app.run(debug=True)
    


