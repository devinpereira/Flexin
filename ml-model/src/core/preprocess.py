import pandas as pd
import json
import os
import pickle
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

BASE_DIR = os.path.dirname(__file__)
RAW_PATH = os.path.join(BASE_DIR, '../../data/raw/workout_dataset.json')
PROCESSED_DIR = os.path.join(BASE_DIR, '../../data/processed')
ENCODERS_PATH = os.path.join(BASE_DIR, '../../models/encoders.pkl')

with open(RAW_PATH, 'r') as f:
    raw_data = json.load(f)

df = pd.json_normalize(raw_data)

# Encode goal
goal_enc = LabelEncoder()
df['goal_encoded'] = goal_enc.fit_transform(df['goal'])

# Encode experience
exp_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
df['experience_encoded'] = df['experience'].map(exp_map)

# Basic features
X = df[['goal_encoded', 'experience_encoded', 'age', 'days_per_week']]

# Extract focus per day
weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

def extract_focus_list(entry_list, day_name):
    focuses = [item['focus'] for item in entry_list if item['day'].strip().lower() == day_name.lower()]
    return list(set(focuses))

df_focus = {day: df['weekly_schedule'].apply(lambda week: extract_focus_list(week, day)) for day in weekdays}

# Target encoding
from sklearn.preprocessing import MultiLabelBinarizer

targets = {}
day_encoders = {}

for day in weekdays:
    lists = df_focus[day].tolist()
    if all(len(l) == 0 for l in lists):
        y_day = pd.DataFrame({'rest': [1] * len(df)})
        day_encoders[day] = None
    else:
        mlb = MultiLabelBinarizer()
        y_day = pd.DataFrame(mlb.fit_transform(lists), columns=mlb.classes_)
        day_encoders[day] = mlb
    targets[day] = y_day

os.makedirs(PROCESSED_DIR, exist_ok=True)
X.to_csv(os.path.join(PROCESSED_DIR, 'X.csv'), index=False)
for day in weekdays:
    targets[day].to_csv(os.path.join(PROCESSED_DIR, f'y_{day.lower()}.csv'), index=False)

encoders_to_save = {
    'goal': goal_enc,
    'days': {day: enc for day, enc in day_encoders.items() if enc}
}

os.makedirs(os.path.dirname(ENCODERS_PATH), exist_ok=True)
with open(ENCODERS_PATH, 'wb') as f:
    pickle.dump(encoders_to_save, f)