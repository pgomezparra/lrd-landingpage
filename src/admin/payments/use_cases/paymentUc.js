import Payment from '@/admin/payments/models/class/payment.js'
import ConsolidatedPayment from '@/admin/payments/models/class/consolidatedPayment.js'
import { format } from '@formkit/tempo'

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

  async createPayment(payment) {
    try {
      const response = await this.#paymentRepository.createPayment(this.processPayment(payment))

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

  async updatePayment(payment) {
    try {
      const data = this.processPayment(payment)
      data.id = payment.id
      const response = await this.#paymentRepository.updatePayment(data)

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

  processPayment(payment) {
    return {
      date: format(payment.date, 'YYYY-MM-DD'),
      description: payment.description,
      month_id: payment.month_id,
      value: parseInt(payment.value),
      payment_type_id: payment.payment_type_id,
      excluded: payment.excluded,
      payment_method_id: payment.payment_method_id,
      year: payment.year,
      student_id: payment.student_id,
      transfer_code: payment.transfer_code
    }
  }
}