import { defineStore } from 'pinia'
import UserRepository from '@/admin/general/models/repositories/userRepository.js'
import UserUc from '@/admin/general/use_cases/userUc.js'
import { markRaw } from 'vue'

const userRepository = new UserRepository()
const userUc = new UserUc(userRepository)

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: ''
  }),
  actions: {
    setToken(token) {
      this.token = token
    },
    async validateUser() {
      try {
        const response = await userUc.validateUser()
        if (response.status === 200) {
          this.user = markRaw(response.user)
        }

        return response.status
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})