import json
import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Load JSON data
with open('../../data/raw/workout_dataset.json') as f:
    users = json.load(f)

rows = []
for user in users:
    goal = user['goal']
    experience = user['experience']
    age = user['age']
    days_per_week = user['days_per_week']

    for schedule in user.get('weekly_schedule', []):
        for ex in schedule.get('exercises', []):
            reps = ex.get('reps')
            try:
                reps_num = sum(map(int, reps.replace("each leg", "").replace("min", "").split('-'))) / 2 if '-' in reps else int(''.join(filter(str.isdigit, reps)))
            except:
                reps_num = 10

            rows.append({
                'goal': goal,
                'experience': experience,
                'age': age,
                'days_per_week': days_per_week,
                'body_part': ex.get('body_part', 'unknown'),
                'difficulty': ex.get('difficulty', 'medium'),
                'sets': ex.get('sets', 3),
                'reps': reps_num
            })

df = pd.DataFrame(rows)
df = df[df['body_part'] != 'unknown']

# Encode categorical values
df['goal_enc'] = df['goal'].map({
    'muscle_gain': 0, 'fat_loss': 1, 'endurance': 2, 'flexibility': 3, 'weight_maintenance': 4
})
df['exp_enc'] = df['experience'].map({'beginner': 0, 'intermediate': 1, 'advanced': 2})
df['body_part_enc'] = df['body_part'].astype('category').cat.codes
df['difficulty_enc'] = df['difficulty'].map({'low': 0, 'medium': 1, 'high': 2})

# Age binning for 18–70, including values below 18 in lowest and above 70 in highest
bins = [-np.inf, 25, 35, 45, 55, np.inf]
labels = [0, 1, 2, 3, 4]
df['age_group'] = pd.cut(df['age'], bins=bins, labels=labels, right=True, include_lowest=True).astype(int)


# Feature matrix and target
X = df[['goal_enc', 'exp_enc', 'age_group', 'days_per_week', 'body_part_enc', 'difficulty_enc']]
y = df[['sets', 'reps']]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

with open('../../models/sets_reps_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model trained and saved as sets_reps_model.pkl")