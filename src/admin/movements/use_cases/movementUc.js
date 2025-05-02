import { format } from '@formkit/tempo'
import Movement from '@/admin/movements/models/class/movement.js'

export default class MovementUc {
  #movementRepository = null

  constructor(movementRepository) {
    this.#movementRepository = movementRepository
  }

  async searchMovements(startDate, endDate) {
    try {
      const response = await this.#movementRepository.searchMovements(startDate, endDate)
      const movements = response.data?.map(movement => Movement.fromJSONResponse(movement))

      return { status: response.status, movements: movements }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, payments: [] }
      } else {
        return { status: 500, payments: [] }
      }
    }
  }

  async createMovement(movement) {
    try {
      const response = await this.#movementRepository.createMovement(this.processMovement(movement))

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data?.message }
      } else {
        return { status: 500 }
      }
    }
  }

  async updateMovement(movement) {
    try {
      const data = this.processMovement(movement)
      data.id = movement.id
      const response = await this.#movementRepository.updateMovement(data)

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data?.message }
      } else {
        return { status: 500 }
      }
    }
  }

  processMovement(movement) {
    return {
      date: format(movement.date, 'YYYY-MM-DD'),
      description: movement.description,
      value: parseInt(movement.value),
      movement_type_id: movement.movement_type_id,
      movement_method_id: movement.movement_method_id,
      year: movement.year
    }
  }
}