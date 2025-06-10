import os
import pickle
import numpy as np

BASE_PATH = os.path.dirname(__file__)
MODELS_PATH = os.path.join(BASE_PATH, '../../models')

# Load model and encoders
with open(os.path.join(MODELS_PATH, 'day1_workout_model.pkl'), 'rb') as f:
    model = pickle.load(f)

with open(os.path.join(MODELS_PATH, 'encoders.pkl'), 'rb') as f:
    encoders = pickle.load(f)

goal_encoder = encoders['goal']
equipment_encoder = encoders['equipment']
day1_encoder = encoders['day1']

def preprocess_input(data):
    # data: dict with keys goal, experience, days_per_week, equipment (list)
    
    # Encode goal
    goal_enc = goal_encoder.transform([data['goal']])[0]
    
    # Encode experience
    experience_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    experience_enc = experience_map.get(data['experience'], 0)
    
    # days_per_week
    days_per_week = data.get('days_per_week', 3)
    
    # Encode equipment (multi-label)
    equip_enc = equipment_encoder.transform([data['equipment']])[0]
    
    # Create input feature vector
    x = np.array([goal_enc, experience_enc, days_per_week])
    x = np.concatenate((x, equip_enc))
    x = x.reshape(1, -1)
    return x

def predict_workout(data):
    x = preprocess_input(data)
    y_pred = model.predict(x)
    
    # Decode predicted muscle groups for day1
    muscle_groups = day1_encoder.inverse_transform(y_pred)
    
    # Return as list (there will be only one sample)
    return muscle_groups[0] if muscle_groups else []