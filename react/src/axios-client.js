import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization header automatically if token exists
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for logging or generic error handling
axiosClient.interceptors.response.use(
    (response) => response, // Return response directly
    (error) => {
        // Only log error here
        console.error("Axios error:", error.response || error);

        // Let the component handle notifications and navigation
        return Promise.reject(error);
    }
);

export default axiosClient;
