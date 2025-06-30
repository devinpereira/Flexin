import { BASE_URL, API_PATHS } from '../utils/apiPaths';


// Get a meal plan by trainer ID
export async function getMealPlan(trainerId, userId) {
  const res = await fetch(`${BASE_URL}${API_PATHS.MEAL_PLAN.GET_MEAL_PLAN(trainerId, userId)}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch meal plan");
  return await res.json();
}

