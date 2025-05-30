import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class MovementRepository {
  async searchMovements(startDate, endDate) {
    let url = `${myUrl(3000)}/api/v1/movements?startAt=${startDate}&endAt=${endDate}`

    return customAxios.get(url)
  }

  async createMovement(movement) {
    let url = `${myUrl(3000)}/api/v1/movements`

    return customAxios.post(url, movement)
  }

  async updateMovement(movement) {
    let url = `${myUrl(3000)}/api/v1/movements/${movement.id}`

    return customAxios.patch(url, movement)
  }
}