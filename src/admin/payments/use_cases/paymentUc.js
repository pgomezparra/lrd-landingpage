import Payment from '@/admin/payments/models/class/payment.js'
import ConsolidatedPayment from '@/admin/payments/models/class/consolidatedPayment.js'
import { format } from '@formkit/tempo'
import ExternalProduct from '@/admin/payments/models/class/externalProduct.js'

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

  async sendSupportPayment(student, payment, consolidated) {
    try {
      const response = await this.#paymentRepository.sendSupportPayment(this.processSupportPayment(student, payment, consolidated))

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

  async getExternalProducts() {
    try {
      const response = await this.#paymentRepository.getExternalProducts()

      return {
        status: response.status,
        products: response.data?.map(product => ExternalProduct.fromJSONResponse(product))
      }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, products: [] }
      } else {
        return { status: 500, products: [] }
      }
    }
  }

  async createElectronicInvoice(invoice) {
    try {
      const response = await this.#paymentRepository.createElectronicInvoice(invoice)

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

  async markAsBilled(id) {
    try {
      const response = await this.#paymentRepository.markAsBilled(id)

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

  processSupportPayment(student, payment, consolidated) {
    const payments = []
    for (let i = 1; i < consolidated.length; i++) {
      payments.push({
        month: consolidated[i].month,
        value: consolidated[i].value,
        balance: consolidated[i].balance
      })
    }

    return {
      id: payment.getId(),
      name: student.getName(),
      surname: student.getSurname(),
      grade: student.getGrade(),
      type: payment.getPaymentType(),
      month: payment.isPension() ? payment.getMonth() : '',
      description: payment.getDescription(),
      date: payment.getDate(),
      method: payment.getPaymentMethod(),
      transfer_code: payment.getTransferCode() ?? '',
      value: payment.getValue(),
      author: payment.getAuthor() ?? 'Automático',
      registration_value: consolidated[0].value,
      registration_balance: consolidated[0].balance,
      destination: student.getEmail(),
      payments: payments
    }
  }
}