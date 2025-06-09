from flask import Flask, request, jsonify
from model.generate_schedule import generate_schedule

app = Flask(__name__)

@app.route("/api/generate-workout", methods=["POST"])
def generate_workout():
    user_data = request.json
    try:
        schedule = generate_schedule(user_data)
        return jsonify(schedule)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)