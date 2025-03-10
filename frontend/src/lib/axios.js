import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5000/api",
    withCredentials: true,
});

// Automatically add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Retrieve token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
