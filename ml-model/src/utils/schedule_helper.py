def get_smart_days(days_per_week):
    """
    Returns a smartly spaced list of weekdays for workouts, depending on how many days per week the user selects.
    Prioritizes recovery by spacing sessions across the week.
    """
    week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_indices = {
        1: [2],                # Wednesday
        2: [1, 5],             # Tuesday, Saturday
        3: [0, 3, 6],          # Monday, Thursday, Sunday
        4: [0, 2, 4, 6],       # Mon, Wed, Fri, Sun
        5: [0, 1, 3, 5, 6],    # Mon, Tue, Thu, Sat, Sun
        6: [0, 1, 2, 4, 5, 6], # Mon, Tue, Wed, Fri, Sat, Sun
        7: list(range(7))      # Every day
    }

    selected_indices = day_indices.get(days_per_week, list(range(days_per_week)))
    return [week[i] for i in selected_indices]
