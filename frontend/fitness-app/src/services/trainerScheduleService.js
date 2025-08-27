const API_BASE_URL = "http://localhost:8000/api/v1/trainer-schedules";

class TrainerScheduleService {
  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Get all subscribers for the current trainer
  async getSubscribers() {
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/subscribers`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch subscribers');

      const data = await response.json();
      return {
        success: true,
        subscribers: data.subscribers || []
      };
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return {
        success: false,
        error: error.message,
        subscribers: []
      };
    }
  }

  // Get all schedules assigned by the trainer
  async getAssignedSchedules() {
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/assigned-schedules`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch assigned schedules');

      const data = await response.json();
      return {
        success: true,
        schedules: data.schedules || []
      };
    } catch (error) {
      console.error('Error fetching assigned schedules:', error);
      return {
        success: false,
        error: error.message,
        schedules: []
      };
    }
  }

  // Get a specific user's schedule
  async getUserSchedule(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/user/${userId}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status === 404) {
        return {
          success: true,
          schedule: null
        };
      }

      if (!response.ok) throw new Error('Failed to fetch user schedule');

      const data = await response.json();
      return {
        success: true,
        schedule: data.schedule
      };
    } catch (error) {
      console.error('Error fetching user schedule:', error);
      return {
        success: false,
        error: error.message,
        schedule: null
      };
    }
  }

  // Assign a new schedule to a user
  async assignSchedule(userId, scheduleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/assign/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) throw new Error('Failed to assign schedule');

      const data = await response.json();
      return {
        success: true,
        schedule: data.schedule,
        message: data.message
      };
    } catch (error) {
      console.error('Error assigning schedule:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update an existing schedule
  async updateSchedule(userId, scheduleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/update/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) throw new Error('Failed to update schedule');

      const data = await response.json();
      return {
        success: true,
        schedule: data.schedule,
        message: data.message
      };
    } catch (error) {
      console.error('Error updating schedule:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete a schedule
  async deleteSchedule(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/user/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete schedule');

      const data = await response.json();
      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get exercises from the database
  async getExercises() {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/exercises`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch exercises');

      const data = await response.json();
      return {
        success: true,
        exercises: data.exercises || []
      };
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return {
        success: false,
        error: error.message,
        exercises: []
      };
    }
  }
}

export default new TrainerScheduleService();
