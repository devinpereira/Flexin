import pandas as pd
import pickle
import os
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

BASE_DIR = os.path.dirname(__file__)
X_PATH = os.path.join(BASE_DIR, '../../data/processed/X.csv')
MODEL_DIR = os.path.join(BASE_DIR, '../../models')
MODEL_PATH = os.path.join(MODEL_DIR, 'workout_model.pkl')

X = pd.read_csv(X_PATH)

weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
y_list = []

for day in weekdays:
    path = os.path.join(BASE_DIR, f'../../data/processed/y_{day}.csv')
    y_list.append(pd.read_csv(path))

y_combined = pd.concat(y_list, axis=1)

clf = MultiOutputClassifier(RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42))
clf.fit(X, y_combined)

y_pred = clf.predict(X)
print(classification_report(y_combined, y_pred, zero_division=0))

os.makedirs(MODEL_DIR, exist_ok=True)
with open(MODEL_PATH, 'wb') as f:
    pickle.dump(clf, f)
print(f"Model saved to {MODEL_PATH}")