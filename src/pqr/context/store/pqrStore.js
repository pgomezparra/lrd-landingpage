import { defineStore } from 'pinia'
import PqrRepository from '@/pqr/models/repositories/pqrRepository.js'
import PqrUc from '@/pqr/use_cases/pqrUc.js'

const uc = new PqrUc(new PqrRepository())

export const usePqrStore = defineStore('pqr', {
  state: () => ({}),
  actions: {
    async createPqr(name, email, message) {
      try {
        const response = await uc.createPqr(name, email, message)

        return response.status === 201
      } catch (error) {
        console.log('createPqr -> ', error)
      }
    }
  }
})