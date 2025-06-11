from flask import Flask, request, jsonify
from predict import predict_plan
from generate import format_schedule

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_schedule():
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400

    try:
        days = data.get('days_per_week', 3)
        raw_preds = predict_plan(data)
        formatted = format_schedule(raw_preds, days, {
            'goal_enc': 0,  # pass static or use mapping as needed
            'exp_enc': {'beginner': 0, 'intermediate': 1, 'advanced': 2}.get(data.get('experience'), 0),
            'age': data.get('age', 25),
            'days_per_week': days
        })
        return jsonify({"weekly_schedule": formatted})
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)