const API_BASE = "http://localhost:8000/api/v1";

// Get all pending trainers (admin only)
export const getPendingTrainers = async () => {
  const res = await fetch(`${API_BASE}/pending-trainer`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await res.json();
};

// Accept trainer application (admin only)
export const approveTrainer = async (pendingTrainerId) => {
  const res = await fetch(`${API_BASE}/pending-trainer/accept/${pendingTrainerId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await res.json();
};

// Reject trainer application (admin only)
export const rejectTrainer = async (pendingTrainerId, reason = "") => {
  const res = await fetch(`${API_BASE}/pending-trainer/reject/${pendingTrainerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ reason }),
  });
  return await res.json();
};