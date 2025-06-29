import { BASE_URL, API_PATHS } from '../utils/apiPaths';

//  Get all trainers
export async function getAllTrainers() {
  const res = await fetch(`${BASE_URL}/api/v1/trainers`);
  if (!res.ok) throw new Error('Failed to fetch trainers');
  const data = await res.json();
  return data.trainers;
}

// Get a trainer by ID
export async function getTrainerById(trainerId) {
  const res = await fetch(`${BASE_URL}${API_PATHS.TRAINER.GET_TRAINER(trainerId)}`);
  console.log("Fetching trainer with ID:", trainerId);
  if (!res.ok) throw new Error('Failed to fetch trainer');
  const data = await res.json();
  // If your backend returns { success, trainer }, return trainer only:
  return data.trainer;
}

// Get all trainers the user has added
export async function getMyTrainers() {
  const res = await fetch(`${BASE_URL}${API_PATHS.TRAINER.GET_MY_TRAINERS}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error('Failed to fetch trainers');
  const data = await res.json();
  return data.trainers;
}

// Add a trainer to "my trainers"
export async function addTrainerFollower(trainerId) {
  const res = await fetch(`${BASE_URL}${API_PATHS.TRAINER.ADD_FOLLOWER}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ trainerId })
  });
  if (!res.ok) throw new Error('Failed to add follower');
  return await res.json();
}

// Remove a trainer from "my trainers"
export async function removeTrainerFollower(trainerId) {
  const res = await fetch(`${BASE_URL}${API_PATHS.TRAINER.REMOVE_FOLLOWER}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ trainerId })
  });
  if (!res.ok) throw new Error('Failed to remove follower');
  return await res.json();
}

// add feedback for a trainer
export async function addTrainerFeedback(trainerId, feedback) {
  const res = await fetch(`${BASE_URL}/api/v1/trainers/${trainerId}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(feedback)
  });
  if (!res.ok) throw new Error('Failed to add feedback');
  return await res.json();
}

// Get a trainer's schedule by ID
export async function getTrainerSchedule(trainerId) {
  const res = await fetch(`${BASE_URL}${API_PATHS.TRAINER.GET_TRAINER_SCHEDULE(trainerId)}`);
  if (!res.ok) throw new Error('Failed to fetch trainer schedule');
  const data = await res.json();
  // If your backend returns { success, schedule }, return schedule only:
  return data.schedule || data; // adjust if your backend returns just the schedule array/object
}

