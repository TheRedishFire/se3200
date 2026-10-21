import sqlite3
from flask import Flask, request, jsonify, abort, render_template

app = Flask(__name__)
DATABASE = 'cars.db'

class CarDatabase:
    def __init__(self, db_path):
        self.db_path = db_path
        self._init_db()

    def get_connection(self):
        db = sqlite3.connect(self.db_path)
        db.row_factory = sqlite3.Row
        return db

    def _init_db(self):
        with self.get_connection() as db:
            # duplicate CREATE TABLE typo
            db.execute("""
                CREATE TABLE IF NOT EXISTS cars (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    make TEXT NOT NULL,
                    model TEXT NOT NULL,
                    trim TEXT,
                    year INTEGER NOT NULL,
                    price REAL NOT NULL
                )
            """)
            db.commit()

    def get_all(self):
        with self.get_connection() as db:
            cars = db.execute("SELECT * FROM cars ORDER BY id").fetchall()
            return [dict(c) for c in cars]

    def get_one(self, car_id):
        with self.get_connection() as db:
            # Fixed "books" to "cars"
            car = db.execute("SELECT * FROM cars WHERE id = ?", (car_id,)).fetchone()
            return dict(car) if car else None

    def create(self, data):
        with self.get_connection() as db:
            cursor = db.execute(
                "INSERT INTO cars (make, model, trim, year, price) VALUES (?, ?, ?, ?, ?)", 
                (data['make'], data['model'], data.get('trim', ''), data['year'], data['price'])
            )
            db.commit()
            return self.get_one(cursor.lastrowid)

    def update(self, car_id, data):
        car = self.get_one(car_id)
        if not car:
            return None
        
        with self.get_connection() as db:
            # add WHERE id = ? so we don't overwrite the whole database 
            db.execute("""
                UPDATE cars 
                SET make = ?, model = ?, trim = ?, year = ?, price = ? 
                WHERE id = ?
            """, (
                data.get('make', car['make']),
                data.get('model', car['model']),
                data.get('trim', car['trim']),
                data.get('year', car['year']),
                data.get('price', car['price']),
                car_id
            ))
            db.commit()
            return self.get_one(car_id)

    def delete(self, car_id):
        if not self.get_one(car_id):
            return False
        with self.get_connection() as db:
            db.execute("DELETE FROM cars WHERE id = ?", (car_id,))
            db.commit()
            return True


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
    


