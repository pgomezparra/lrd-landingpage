import Payment from '@/admin/payments/models/class/payment.js'

export default class PaymentUc {
  #paymentRepository = null

  constructor(paymentRepository) {
    this.#paymentRepository = paymentRepository
  }

  async searchPayments(studentId, year) {
    try {
      const response = await this.#paymentRepository.searchPayments(studentId, year)
      const payments = response.data.map(payment => Payment.fromJSONResponse(payment))

      return { status: response.status, payments: payments }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, payments: [] }
      } else {
        return { status: 500, payments: [] }
      }
    }
  }
}