import json
import os

BASE_DIR = os.path.dirname(__file__)
EX_DB_PATH = os.path.join(BASE_DIR, '../../models/exercise_db.json')

with open(EX_DB_PATH, 'r') as f:
    exercise_db = json.load(f)

def format_schedule(predicted_focus, days_per_week):
    day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    selected = day_order[:days_per_week]

    schedule = []
    for day in selected:
        focuses = predicted_focus.get(day, [])
        exercises = []
        for focus_tag in focuses:
            for ex_id, ex_info in exercise_db.items():
                if ex_info["body_part"] in focus_tag.lower() or ex_info["body_part"] in focus_tag.split()[0].lower():
                    exercises.append({ 
                        "id": ex_id,
                        "name": ex_info["name"],
                        "sets": None,
                        "reps": None,
                        "body_part": ex_info["body_part"],
                        "difficulty": ex_info["difficulty"]
                    })
        schedule.append({
            "day": day,
            "focus": focuses,
            "exercises": exercises[:6]
        })
    return schedule