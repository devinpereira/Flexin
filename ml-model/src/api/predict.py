import os
import pickle
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, '../../models/workout_model.pkl')
ENCODERS_PATH = os.path.join(BASE_DIR, '../../models/encoders.pkl')

with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)
with open(ENCODERS_PATH, 'rb') as f:
    encoders = pickle.load(f)

goal_enc = encoders['goal']
day_encoders = encoders['days']

exp_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}

def preprocess_input(data):
    goal_val = goal_enc.transform([data['goal']])[0]
    exp_val = exp_map.get(data['experience'], 0)
    age = data.get('age', 25)
    days = data.get('days_per_week', 3)
    features = np.array([[goal_val, exp_val, age, days]])
    columns = ['goal_encoded', 'experience_encoded', 'age', 'days_per_week']
    return pd.DataFrame(features, columns=columns)

def predict_plan(data):
    x = preprocess_input(data)
    y_pred = model.predict(x)

    print("=== Raw Prediction ===")
    print(y_pred)

    result = {}
    offset = 0
    for day, mlb in day_encoders.items():
        n = len(mlb.classes_)
        day_slice = y_pred[:, offset:offset+n]
        decoded = mlb.inverse_transform(day_slice)
        result[day] = list(decoded[0]) if decoded else []
        offset += n
    return result