import Consolidated from '@/admin/dashboard/models/class/consolidated.js'

export default class DashboardUc {
  #dashboardRepository = null

  constructor(dashboardRepository) {
    this.#dashboardRepository = dashboardRepository
  }

  async getConsolidated(year) {
    try {
      const response = await this.#dashboardRepository.getConsolidated(year)
      const consolidated = Consolidated.fromJSONResponse(response.data)

      return { status: response.status, consolidated: consolidated }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, consolidated: null }
      } else {
        return { status: 500, consolidated: null }
      }
    }
  }
}