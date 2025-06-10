import os
import pickle
import numpy as np

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, '../../models/workout_model.pkl')
ENCODERS_PATH = os.path.join(BASE_DIR, '../../models/encoders.pkl')

with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)
with open(ENCODERS_PATH, 'rb') as f:
    encoders = pickle.load(f)

goal_enc = encoders['goal']
equip_enc = encoders['equipment']
day_encoders = encoders['days']

exp_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}

def preprocess_input(data):
    g = data['goal']
    e = data['experience']
    age = data.get('age', 25)
    days = data.get('days_per_week', 3)
    equipment_list = data.get('equipment', [])

    goal_val = goal_enc.transform([g])[0]
    exp_val = exp_map.get(e, 0)
    equip_vec = equip_enc.transform([equipment_list])[0]

    features = np.array([goal_val, exp_val, age, days])
    return np.concatenate((features, equip_vec)).reshape(1, -1)

def predict_plan(data):
    x = preprocess_input(data)
    y_pred = model.predict(x)

    result = {}
    offset = 0
    for day, mlb in day_encoders.items():
        n = len(mlb.classes_)
        day_slice = y_pred[:, offset:offset+n]
        decoded = mlb.inverse_transform(day_slice)
        result[day] = list(decoded[0]) if decoded else []
        offset += n
    return result