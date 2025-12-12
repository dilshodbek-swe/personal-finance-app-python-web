import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
