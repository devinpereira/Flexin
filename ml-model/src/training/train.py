import pandas as pd
import pickle
import os
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report

# Paths
base_path = os.path.dirname(__file__)
X_path = os.path.join(base_path, '../../data/processed/X.csv')
y_path = os.path.join(base_path, '../../data/processed/y_day1.csv')
model_path = os.path.join(base_path, '../../models/day1_workout_model.pkl')

# Load data
X = pd.read_csv(X_path)
y = pd.read_csv(y_path)

# Train model
model = DecisionTreeClassifier(max_depth=5, random_state=42)
model.fit(X, y)

# Evaluate (prints to console)
y_pred = model.predict(X)
print(classification_report(y, y_pred))

# Save model
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"Model saved to {model_path}")