import CashConsolidated from '@/admin/reports/models/class/cashConsolidated.js'
import Movement from '@/admin/reports/models/class/movement.js'
import Debtor from '@/admin/reports/models/class/debtor.js'
import DebtConsolidated from '@/admin/reports/models/class/debtConsolidated.js'

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

  async getDebtors(year, month, gradeId, paymentType) {
    try {
      const response = await this.#reportRepository.getDebtors(year, month, gradeId, paymentType)
      const debtors = response.data?.debtors.map(debtor => Debtor.fromJSONResponse(debtor))
      return {
        status: response.status,
        debtors: debtors,
        consolidated: DebtConsolidated.fromJSONResponse(response.data?.consolidated)
      }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, debtors: [], consolidated: null }
      } else {
        return { status: 500, debtors: [], consolidated: null }
      }
    }
  }
}