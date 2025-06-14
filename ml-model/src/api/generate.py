import json
import os
import pickle
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(__file__)
EX_DB_PATH = os.path.join(BASE_DIR, '../../data/raw/exercise_db.json')
SETS_REPS_MODEL_PATH = os.path.join(BASE_DIR, '../../models/sets_reps_model.pkl')

with open(EX_DB_PATH, 'r') as f:
    exercise_db = json.load(f)

with open(SETS_REPS_MODEL_PATH, 'rb') as f:
    sets_reps_model = pickle.load(f)
    

FOCUS_TO_BODY_PART = {
    "upper body push": ["chest", "shoulders", "triceps"],
    "upper body pull": ["back", "biceps"],
    "lower body": ["quads", "hamstrings", "glutes", "calves"],
    "full body": ["chest", "back", "lower_back", "legs", "arms", "core"],
    "core": ["core", "abs"],
    "cardio": ["cardio"],
    "arms": ["triceps", "biceps"],
    "legs": ["quads", "hamstrings", "calves", "glutes"],
    "back": ["back", "lower_back"],
    "chest": ["chest"],
    "shoulders": ["shoulders"],
    "flexibility": ["full_body", "legs", "core"]
}


def get_smart_days(days_per_week):
    week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_indices = {
        1: [2], 2: [1, 5], 3: [0, 3, 6], 4: [0, 2, 4, 6],
        5: [0, 1, 3, 5, 6], 6: [0, 1, 2, 4, 5, 6], 7: list(range(7))
    }
    selected_indices = day_indices.get(days_per_week, list(range(days_per_week)))
    return [week[i] for i in selected_indices]

def get_age_group(age):
    if 18 <= age <= 25:
        return 0
    elif age <= 35:
        return 1
    elif age <= 45:
        return 2
    elif age <= 55:
        return 3
    else:
        return 4

def format_schedule(predicted_focus, days_per_week, user_profile=None):
    selected = get_smart_days(days_per_week)
    schedule = []

    for day in selected:
        focuses = predicted_focus.get(day, [])
        exercises = []
        for focus_tag in focuses:
            matched_parts = FOCUS_TO_BODY_PART.get(focus_tag.lower(), [])
            for ex_id, ex_info in exercise_db.items():
                if ex_info["body_part"].lower() in matched_parts:
                    sets, reps = 3, 10
                    if user_profile:
                        try:
                            age_group = get_age_group(user_profile.get('age', 25))
                            pred_input = pd.DataFrame([{
                                'goal_enc': user_profile.get('goal_enc', 0),
                                'exp_enc': user_profile.get('exp_enc', 0),
                                'age_group': age_group,
                                'days_per_week': user_profile.get('days_per_week', 3),
                                'body_part_enc': ex_info.get("body_part_enc", 0),
                                'difficulty_enc': ex_info.get("difficulty_enc", 0)
                            }])
                            
                            pred = sets_reps_model.predict(pred_input)[0]
                            sets = int(round(pred[0]))
                            reps = int(round(pred[1]))
                        except Exception as e:
                            print(f"[PREDICTION ERROR] {e}")
                    exercises.append({
                        "id": ex_id,
                        "name": ex_info["name"],
                        "sets": sets,
                        "reps": reps,
                        "body_part": ex_info["body_part"],
                        "difficulty": ex_info["difficulty"]
                    })
        if not exercises:
            print(f"[WARNING] No exercises found for {day} with focuses: {focuses}")
            with open("empty_focus_log.txt", "a") as log_file:
                log_file.write(f"No exercises found for {day} with focuses: {focuses}\n")
        schedule.append({
            "day": day,
            "focus": focuses,
            "exercises": exercises[:6]
        })
    return schedule