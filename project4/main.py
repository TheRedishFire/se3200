from flask import Flask, render_template, request, jsonify
import json
import os
app = Flask(__name__)

# in a real project I know we wouldnt do it this way but i wanna practice
# changing between json and python lists.

FILE_NAME = "storage.json"

def get_stored_msgs():
    if not os.path.exists(FILE_NAME):
        return []
    with open(FILE_NAME, "r", encoding="utf-8") as f:
        try:
            return json.load(f)  # changes json into python list
        except json.JSONDecodeError:
            return []

def add_msg_to_memory(new_msg):
    items = get_stored_msgs()
    items.append(new_msg)

    with open(FILE_NAME, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)  # Converts list to JSON text in file

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api", methods=['GET'])
def get_msgs(): # gets the messages from json file then puts them on page
    stored_msgs = get_stored_msgs()
    return jsonify(stored_msgs), 200

@app.route("/api", methods=['POST'])
def post_msg():
    data = request.get_json() # converts to pythong dic {"message": "Hello!"}
    # from the js post function
    text = data["message"]
    add_msg_to_memory(text)
    # 201 = "a new resource was created"
    return "", 201

@app.errorhandler(404)
def page_not_found(error):
    return "", 404



