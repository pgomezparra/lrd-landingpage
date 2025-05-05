import CashConsolidated from '@/admin/reports/models/class/cashConsolidated.js'
import Movement from '@/admin/reports/models/class/movement.js'

export default class ReportUc {
  #reportRepository = null

  constructor(reportRepository) {
    this.#reportRepository = reportRepository
  }

  async dailyCash(startDate, endDate) {
    try {
      const response = await this.#reportRepository.dailyCash(startDate, endDate)
      const consolidated = CashConsolidated.fromJSONResponse(response.data?.consolidated)
      const movements = response.data?.movements.map(movement => Movement.fromJSONResponse(movement))

      return { status: response.status, consolidated: consolidated, movements: movements }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, consolidated: null, movements: [] }
      } else {
        return { status: 500, consolidated: null, movements: [] }
      }
    }
  }
}