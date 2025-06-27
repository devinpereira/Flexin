import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Create a custom axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - adds auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to request headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles common error responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Extract most helpful error message
    let errorMessage = "An error occurred. Please try again later.";

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      // For HTML error responses (like from Express error handler)
      if (error.response.headers["content-type"]?.includes("text/html")) {
        // Keep original error for debugging but show friendly message
        console.error("Server HTML error:", error.response.data);

        // Check if it's a Cloudinary error
        if (
          typeof error.response.data === "string" &&
          error.response.data.includes("Error: Must supply api_key")
        ) {
          errorMessage =
            "Image upload service is currently unavailable. You can still post without images.";
        } else {
          errorMessage = "Server error. Please try again later.";
        }
      }
      // For JSON error responses
      else if (error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      // Handle specific status codes
      if (error.response.status === 401) {
        // If token is expired, redirect to login
        console.log("Unauthorized. Redirecting to login...");
        // Uncomment the following line in production:
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      errorMessage = "No response from server. Please check your connection.";
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request error:", error.message);
    }

    // You could show a toast notification here

    return Promise.reject(error);
  }
);

export default axiosInstance;