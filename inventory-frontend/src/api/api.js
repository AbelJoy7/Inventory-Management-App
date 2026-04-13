import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Add a request interceptor to attach the JWT token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors using the refresh token
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });
          if (res.status === 200) {
            localStorage.setItem("access_token", res.data.access);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return API(originalRequest);
          }
        } else {
          // If no refresh token, log out
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
      } catch (refreshError) {
        // Refresh token failed, clear local storage and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;