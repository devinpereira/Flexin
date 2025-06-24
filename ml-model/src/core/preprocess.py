import pandas as pd
import json
import os
import pickle
import random
import re
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer

BASE_DIR = os.path.dirname(__file__)
RAW_PATH = os.path.join(BASE_DIR, '../../data/raw/workout_dataset.json')
PROCESSED_DIR = os.path.join(BASE_DIR, '../../data/processed')
ENCODERS_PATH = os.path.join(BASE_DIR, '../../models/encoders.pkl')

# Load raw JSON data
with open(RAW_PATH, 'r') as f:
    raw_data = json.load(f)

df = pd.json_normalize(raw_data)

# Encode goal (Label Encoding)
goal_enc = LabelEncoder()
df['goal_encoded'] = goal_enc.fit_transform(df['goal'])

# Map experience to numeric
exp_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
df['experience_encoded'] = df['experience'].map(exp_map)

# Basic features dataframe
X = df[['goal_encoded', 'experience_encoded', 'age', 'days_per_week']]

# Days of the week
weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

def extract_focus_list(entry_list, day_name):
    focuses = [item['focus'] for item in entry_list if item['day'].strip().lower() == day_name.lower()]
    return list(set(focuses))

# Extract focus per day for every user
df_focus = {day: df['weekly_schedule'].apply(lambda week: extract_focus_list(week, day)) for day in weekdays}

# Default focus options if none present
default_focuses = [
    'full body', 'lower body', 'upper body pull',
    'upper body push', 'core', 'cardio', 'flexibility'
]

# Assign random default if empty list for day
for day in weekdays:
    df_focus[day] = df_focus[day].apply(lambda f: f if f else [random.choice(default_focuses)])

# Function to clean column names to avoid duplicates
def clean_col_name(name):
    return re.sub(r'\s+', '_', name.strip().lower())

# Encode targets per day with MultiLabelBinarizer + clean columns
targets = {}
day_encoders = {}

for day in weekdays:
    lists = df_focus[day].tolist()
    if all(len(l) == 0 for l in lists):
        # If no focus at all, mark as rest day
        y_day = pd.DataFrame({'rest': [1] * len(df)})
        day_encoders[day] = None
    else:
        mlb = MultiLabelBinarizer()
        y_day_raw = mlb.fit_transform(lists)
        clean_classes = [clean_col_name(c) for c in mlb.classes_]
        y_day = pd.DataFrame(y_day_raw, columns=clean_classes)
        day_encoders[day] = mlb
    targets[day] = y_day

# Make sure processed dir exists
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Save feature data
X.to_csv(os.path.join(PROCESSED_DIR, 'X.csv'), index=False)

# Save all target day files
for day in weekdays:
    targets[day].to_csv(os.path.join(PROCESSED_DIR, f'y_{day.lower()}.csv'), index=False)

# Save encoders for future use (only non-None encoders)
encoders_to_save = {
    'goal': goal_enc,
    'days': {day: enc for day, enc in day_encoders.items() if enc}
}

os.makedirs(os.path.dirname(ENCODERS_PATH), exist_ok=True)
with open(ENCODERS_PATH, 'wb') as f:
    pickle.dump(encoders_to_save, f)
