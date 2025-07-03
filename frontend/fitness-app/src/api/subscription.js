import { BASE_URL } from '../utils/apiPaths';

// Get current subscription for a trainer
export async function getSubscription(trainerId) {
  const res = await fetch(`${BASE_URL}/api/v1/subscription/${trainerId}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return await res.json();
}

// Subscribe or change package
export async function subscribeToPackage(trainerId, packageName) {
  const res = await fetch(`${BASE_URL}/api/v1/subscription/${trainerId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ package: packageName })
  });
  if (!res.ok) throw new Error("Failed to subscribe");
  return await res.json();
}

// Cancel subscription
export async function cancelSubscription(trainerId) {
  const res = await fetch(`${BASE_URL}/api/v1/subscription/${trainerId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to cancel subscription");
  return await res.json();
}