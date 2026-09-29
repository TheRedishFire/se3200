from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In a real project this would be a file on disk.
# For this walkthrough, just an in-memory list so you can see the flow.
messages = []

@app.route("/")
def home():
    return render_template("index.html")

# "when an HTTP request arrives with the path /messages and method GET, run this function."
@app.route("/messages", methods=["GET"])
def get_messages():
    # `messages` is a Python list. jsonify turns it into JSON text
    # and sends it with Content-Type: application/json.
    return jsonify(messages), 200


@app.route("/messages", methods=["POST"])
def add_message():
    # The JS client sent JSON in the request body.
    # request.get_json() parses that text into a Python dict.
    data = request.get_json()
    text = data["message"]
    messages.append(text)

    # 201 = "a new resource was created"
    return "", 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)