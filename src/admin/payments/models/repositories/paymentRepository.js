import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class PaymentRepository {
  async searchPayments(studentId, year) {
    let url = `${myUrl(3000)}/api/v1/payments?studentId=${studentId}&year=${year}`

    return customAxios.get(url)
  }
}