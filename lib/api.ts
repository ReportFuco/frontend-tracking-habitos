import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const AUTH_TOKEN_KEY = "auth_token"
const LEGACY_TOKEN_KEY = "token"
const LOGIN_PATH = "/usuarios"

let isHandlingUnauthorized = false

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") {
      return Promise.reject(error)
    }

    const hasAuthHeader = Boolean(error?.config?.headers?.Authorization)

    if (error?.response?.status === 401 && hasAuthHeader && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true

      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(LEGACY_TOKEN_KEY)

      const currentPath = `${window.location.pathname}${window.location.search}`
      const shouldKeepNext = window.location.pathname !== LOGIN_PATH
      const nextParam = shouldKeepNext ? `?next=${encodeURIComponent(currentPath)}` : ""

      window.location.replace(`${LOGIN_PATH}${nextParam}`)
    }

    return Promise.reject(error)
  },
)
