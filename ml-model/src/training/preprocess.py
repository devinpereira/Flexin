import pandas as pd
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import pickle
import os

# Load dataset
DATA_PATH = os.path.join(os.path.dirname(__file__), '../../data/raw/dummy_workout_dataset.json')
df = pd.read_json(DATA_PATH)

# Encode categorical features
goal_encoder = LabelEncoder()
df['goal_encoded'] = goal_encoder.fit_transform(df['goal'])

experience_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
df['experience_encoded'] = df['experience'].map(experience_map)

equipment_encoder = MultiLabelBinarizer()
equipment_encoded = equipment_encoder.fit_transform(df['equipment'])

# Features
X = pd.concat([
    df[['goal_encoded', 'experience_encoded', 'days_per_week']],
    pd.DataFrame(equipment_encoded, columns=equipment_encoder.classes_)
], axis=1)

# Target: multi-label muscle groups for Day 1 only (for now)
day1_encoder = MultiLabelBinarizer()
y_day1 = day1_encoder.fit_transform(df['day1'])

# Save preprocessed data
os.makedirs(os.path.join(os.path.dirname(__file__), '../../data/processed'), exist_ok=True)
X.to_csv(os.path.join(os.path.dirname(__file__), '../../data/processed/X.csv'), index=False)
pd.DataFrame(y_day1, columns=day1_encoder.classes_).to_csv(os.path.join(os.path.dirname(__file__), '../../data/processed/y_day1.csv'), index=False)

# Save encoders
with open(os.path.join(os.path.dirname(__file__), '../../models/encoders.pkl'), 'wb') as f:
    pickle.dump({
        'goal': goal_encoder,
        'equipment': equipment_encoder,
        'day1': day1_encoder
    }, f)