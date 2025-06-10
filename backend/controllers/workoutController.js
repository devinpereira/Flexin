import axios from 'axios';

const FLASK_API_URL = 'http://localhost:5000/generate';

export const getWorkoutPlan = async (req, res) => {
  try {
    const userData = req.body;

    // Call Flask ML API
    const response = await axios.post(FLASK_API_URL, userData);
    const workoutPlan = response.data;

    res.json(workoutPlan);
  } catch (error) {
    console.error('Error calling ML API:', error.message);
    res.status(500).json({ error: 'Failed to fetch workout plan' });
  }
};