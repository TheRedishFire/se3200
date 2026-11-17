import sqlite3
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
            with open('schema.sql', 'r') as f:
                sql_script = f.read()
            db.executescript(sql_script)
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
            return None, 404
        
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
    
    def create_user(self, first_name, last_name, email, pw_hash):
        try:
            with self.get_connection() as db:
                cur = db.execute(
                    "INSERT INTO users (first_name, last_name, email, password_hash) "
                    "VALUES (?, ?, ?, ?)",
                    (first_name, last_name, email, pw_hash),
                )
                db.commit()
                return self.get_user(cur.lastrowid)
        except sqlite3.IntegrityError:
            return None   # caller treats None as "email taken" → 409

    def get_user(self, user_id):
        with self.get_connection() as db:
            row = db.execute(
                "SELECT id, first_name, last_name, email FROM users WHERE id = ?",
                (user_id,),
            ).fetchone()
            return dict(row) if row else None

    def get_user_by_email(self, email):
        with self.get_connection() as db:
            row = db.execute(
                "SELECT * FROM users WHERE email = ?",
                (email,),
            ).fetchone()
            return dict(row) if row else None
