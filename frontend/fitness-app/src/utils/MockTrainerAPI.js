/**
 * Mock implementation of trainer application API
 * This simulates API responses for frontend development
 * without requiring actual backend integration
 */

export const submitTrainerApplication = async (applicationData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate successful API response
  return {
    success: true,
    message: "Application submitted successfully",
    applicationId: "mock-app-" + Math.random().toString(36).substr(2, 9)
  };

  // To simulate an error, uncomment the following:
  // throw new Error("Failed to submit application");
};
