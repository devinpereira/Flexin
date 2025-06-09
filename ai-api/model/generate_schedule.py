# /ai-api/model/generate_schedule.py
import numpy as np
from tensorflow.keras.models import load_model
from .preprocess import preprocess_user_data

model = load_model("model/workout_model.h5")

EXERCISES = [
    "Push Ups", "Squats", "Deadlifts", "Lunges", "Plank",
    "Burpees", "Mountain Climbers", "Jump Rope", "Bench Press", "Bicep Curls"
]

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def generate_schedule(user_data):
    input_array = preprocess_user_data(user_data)
    predictions = model.predict(input_array)[0]  # Example: returns probabilities or weights

    schedule = []
    for day in DAYS:
        daily_exercises = []
        top_indices = predictions.argsort()[-3:][::-1]  # Top 3 exercises
        for idx in top_indices:
            daily_exercises.append({
                "name": EXERCISES[idx % len(EXERCISES)],
                "sets": int(np.clip(predictions[idx] * 5, 2, 5)),
                "reps": int(np.clip(predictions[idx] * 15, 8, 15)),
                "duration": int(np.clip(predictions[idx] * 45, 15, 45))
            })
        schedule.append({"day": day, "exercises": daily_exercises})

    return schedule
