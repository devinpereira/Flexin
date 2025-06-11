import axios from 'axios';
import User from '../models/User.js';
import Schedule from '../models/Schedule.js';

const generateSchedulesForAllUsers = async () => {
  try {
    const users = await User.find();

    for (let user of users) {
      const res = await axios.post('http://localhost:5000/generate', {
        goal: user.goal,
        experience: user.experience,
        age: user.age,
        days_per_week: user.days_per_week
      });

      const schedule = new Schedule({
        userId: user._id,
        weekly_schedule: res.data.weekly_schedule
      });

      await schedule.save();
      console.log(`Schedule generated for ${user.name}`);
    }
  } catch (err) {
    console.error('Error generating schedules:', err);
  }
};

export default generateSchedulesForAllUsers;