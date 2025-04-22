import Payment from '@/admin/payments/models/class/payment.js'
import ConsolidatedPayment from '@/admin/payments/models/class/consolidatedPayment.js'

export default class PaymentUc {
  #paymentRepository = null

  constructor(paymentRepository) {
    this.#paymentRepository = paymentRepository
  }

  async searchPayments(studentId, year) {
    try {
      const response = await this.#paymentRepository.searchPayments(studentId, year)
      const payments = response.data?.payments?.map(payment => Payment.fromJSONResponse(payment))
      const consolidatedPayments = response.data?.consolidated.map(consolidatedPayment => ConsolidatedPayment.fromJSONResponse(consolidatedPayment))

      return { status: response.status, payments: payments, consolidatedPayments: consolidatedPayments }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, payments: [], consolidatedPayments: [] }
      } else {
        return { status: 500, payments: [], consolidatedPayments: [] }
      }
    }
  }
}