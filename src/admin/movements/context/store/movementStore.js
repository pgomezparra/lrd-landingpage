import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import MovementRepository from '@/admin/movements/models/repositories/movementRepository.js'
import MovementUc from '@/admin/movements/use_cases/movementUc.js'

const movementRepository = new MovementRepository()
const movementUc = new MovementUc(movementRepository)

export const useMovementStore = defineStore('movements', {
  state: () => ({
    selectedMovement: null
  }),
  actions: {
    setSelectedPayment(movement) {
      if (movement === null) {
        this.selectedMovement = null
        return
      }
      this.selectedMovement = markRaw(movement)
    },
    async searchMovements(startDate, endDate) {
      try {
        const response = await movementUc.searchMovements(startDate, endDate)

        return markRaw(response.movements)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async createMovement(movement) {
      try {
        return await movementUc.createMovement(movement)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async updateMovement(movement) {
      try {
        return await movementUc.updateMovement(movement)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})