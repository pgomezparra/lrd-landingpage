import axios from 'axios'
import { useUserStore } from '@/admin/general/context/store/userStore.js'

export const customAxios = axios.create({
  timeout: 10000
})

customAxios.interceptors.request.use(async function(config) {
  const userStore = useUserStore()
  const token = userStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})