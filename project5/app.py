from flask import Flask, request, jsonify, abort, render_template
from db_interface import CarDatabase

app = Flask(__name__)
DATABASE = 'cars.db'
db_manager = CarDatabase(DATABASE)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/cars', methods=['GET'])
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


@app.after_request
def add_cors_headers(response):
    # any website can access this API
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    
    return response


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed for this route"}), 405

if __name__ == '__main__':
    app.run(debug=True)
    


