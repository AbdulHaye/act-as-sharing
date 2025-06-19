import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers["x-auth-token"] = token // Add for backend compatibility
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        originalRequest.headers["x-auth-token"] = newToken
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        if (!originalRequest.headers["X-Skip-Redirect"]) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/"
        }
      }
    }
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

const refreshToken = async () => {
  const response = await axiosInstance.post("/users/refresh-token", {}, {
    headers: { "X-Skip-Redirect": "true" }
  })
  const { token } = response.data
  localStorage.setItem("token", token)
  return token
}

export default axiosInstance