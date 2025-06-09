# /ai-api/model/preprocess.py
import numpy as np

# Example encoding maps for categorical fields (adjust based on your dataset)
GOAL_MAP = {
    "weight_loss": 0,
    "muscle_gain": 1,
    "endurance": 2,
    "flexibility": 3,
}

FITNESS_LEVEL_MAP = {
    "beginner": 0,
    "intermediate": 1,
    "advanced": 2,
}

def preprocess_user_data(user_data):
    """
    Convert user input dict into model input array.
    Expected keys: age, weight, height, fitnessLevel, goal
    """
    age = user_data.get("age", 25)
    weight = user_data.get("weight", 70)
    height = user_data.get("height", 170)
    fitness_level = FITNESS_LEVEL_MAP.get(user_data.get("fitnessLevel", "beginner").lower(), 0)
    goal = GOAL_MAP.get(user_data.get("goal", "weight_loss").lower(), 0)

    # Normalize numerical data roughly (adjust based on your training)
    age_norm = age / 100
    weight_norm = weight / 200
    height_norm = height / 250

    # Return shaped array for model input
    return np.array([[age_norm, weight_norm, height_norm, fitness_level, goal]])
