# generate.py
import json
import os
import pickle
import numpy as np

BASE_DIR = os.path.dirname(__file__)
EX_DB_PATH = os.path.join(BASE_DIR, '../../models/exercise_db.json')
SETS_REPS_MODEL_PATH = os.path.join(BASE_DIR, '../../models/sets_reps_model.pkl')

with open(EX_DB_PATH, 'r') as f:
    exercise_db = json.load(f)

with open(SETS_REPS_MODEL_PATH, 'rb') as f:
    sets_reps_model = pickle.load(f)

# Mapping from focus tags to relevant body parts
FOCUS_TO_BODY_PART = {
    "upper body push": ["chest", "shoulders", "triceps"],
    "upper body pull": ["back", "biceps"],
    "lower body": ["quads", "hamstrings", "glutes", "calves"],
    "full body": ["chest", "back", "legs", "arms", "core"],
    "core": ["core", "abs"],
    "cardio": ["cardio"],
    "arms": ["biceps", "triceps"],
    "legs": ["quads", "hamstrings", "calves", "glutes"],
    "back": ["back"],
    "chest": ["chest"],
    "shoulders": ["shoulders"],
}

def get_smart_days(days_per_week):
    week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_indices = {
        1: [2], 2: [1, 5], 3: [0, 3, 6], 4: [0, 2, 4, 6],
        5: [0, 1, 3, 5, 6], 6: [0, 1, 2, 4, 5, 6], 7: list(range(7))
    }
    selected_indices = day_indices.get(days_per_week, list(range(days_per_week)))
    return [week[i] for i in selected_indices]


def format_schedule(predicted_focus, days_per_week, user_profile=None):
    selected = get_smart_days(days_per_week)

    schedule = []
    for day in selected:
        focuses = predicted_focus.get(day, [])
        exercises = []

        for focus_tag in focuses:
            focus_key = focus_tag.lower()
            matched_parts = FOCUS_TO_BODY_PART.get(focus_key, [])

            for ex_id, ex_info in exercise_db.items():
                if ex_info["body_part"].lower() in matched_parts:
                    sets, reps = 3, 10  # default
                    if user_profile:
                        try:
                            pred_input = np.array([[
                                user_profile.get('goal_enc', 0),
                                user_profile.get('exp_enc', 0),
                                user_profile.get('age', 25),
                                user_profile.get('days_per_week', 3),
                                ex_info.get("body_part_enc", 0),
                                ex_info.get("difficulty_enc", 0)
                            ]])
                            pred = sets_reps_model.predict(pred_input)[0]
                            sets = int(round(pred[0]))
                            reps = int(round(pred[1]))
                        except Exception as e:
                            pass

                    exercises.append({
                        "id": ex_id,
                        "name": ex_info["name"],
                        "sets": sets,
                        "reps": reps,
                        "body_part": ex_info["body_part"],
                        "difficulty": ex_info["difficulty"]
                    })

        schedule.append({
            "day": day,
            "focus": focuses,
            "exercises": exercises[:6]  # limit to 6 exercises max
        })

    return schedule