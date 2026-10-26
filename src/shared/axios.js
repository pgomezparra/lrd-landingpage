import axios from 'axios'
import { useUserStore } from '@/admin/general/context/store/userStore.js'

export const customAxios = axios.create({
  timeout: 10000
})

let refreshTokenHandler = null
let unauthorizedHandler = null
let refreshPromise = null
let redirectPromise = null

export const setAuthHandlers = ({ refreshToken, onUnauthorized }) => {
  refreshTokenHandler = refreshToken
  unauthorizedHandler = onUnauthorized
}

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = Promise.resolve(refreshTokenHandler()).finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

const redirectToLogin = async () => {
  if (!unauthorizedHandler) return

  if (!redirectPromise) {
    redirectPromise = Promise.resolve(unauthorizedHandler()).finally(() => {
      redirectPromise = null
    })
  }

  await redirectPromise
}

customAxios.interceptors.request.use(async function(config) {
  const userStore = useUserStore()
  const token = userStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status !== 401 || !originalRequest || !refreshTokenHandler) {
      return Promise.reject(error)
    }

    const userStore = useUserStore()

    if (originalRequest._retry) {
      userStore.setToken('')
      await redirectToLogin()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const token = await refreshAccessToken()

      if (!token) {
        userStore.setToken('')
        return Promise.reject(error)
      }

      userStore.setToken(token)
      originalRequest.headers.Authorization = `Bearer ${token}`

      return customAxios(originalRequest)
    } catch (refreshError) {
      userStore.setToken('')
      await redirectToLogin()
      return Promise.reject(refreshError)
    }
  }
)
