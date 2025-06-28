import { BASE_URL, API_PATHS } from '../utils/apiPaths';

export async function getTrainerById(trainerId) {
  const res = await fetch(`${BASE_URL}${API_PATHS.TRAINER.GET_TRAINER(trainerId)}`);
  if (!res.ok) throw new Error('Failed to fetch trainer');
  const data = await res.json();
  // If your backend returns { success, trainer }, return trainer only:
  return data.trainer;
}