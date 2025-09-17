import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class PaymentRepository {
  async searchPayments(studentId, year) {
    let url = `${myUrl(3000)}/api/v1/payments?studentId=${studentId}&year=${year}`

    return customAxios.get(url)
  }

  async createPayment(payment) {
    let url = `${myUrl(3000)}/api/v1/payments`

    return customAxios.post(url, payment)
  }

  async updatePayment(payment) {
    let url = `${myUrl(3000)}/api/v1/payments/${payment.id}`

    return customAxios.patch(url, payment)
  }

  async sendSupportPayment(data) {
    let url = `${myUrl(3000)}/api/v1/payment/send`

    return customAxios.post(url, data)
  }

  async getExternalProducts() {
    let url = `${myUrl(3000)}/api/v1/payments/external/products`

    return customAxios.get(url)
  }

  async createElectronicInvoice(data) {
    let url = `${myUrl(3000)}/api/v1/payments/electronic-invoice`

    return customAxios.post(url, data)
  }
}