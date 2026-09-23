import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Add authentication token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API responses/errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Intentional request cancellation
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.code === "ECONNABORTED") {
      console.error(
        "API Error: Request timed out"
      );
    } else {
      console.error(
        "API Error:",
        error.response?.data ||
          error.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;