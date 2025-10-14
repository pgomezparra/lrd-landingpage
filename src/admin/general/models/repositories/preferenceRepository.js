import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class PreferenceRepository {
  async getYears() {
    let url = `${myUrl(3000)}/api/v1/years`

    return customAxios.get(url)
  }

  async saveYear(year) {
    let url = `${myUrl(3000)}/api/v1/years`

    const data = {
      year: year
    }

    return customAxios.post(url, data)
  }

  async getGrades() {
    let url = `${myUrl(3000)}/api/v1/grades`

    return customAxios.get(url)
  }

  async getMonths() {
    let url = `${myUrl(3000)}/api/v1/months`

    return customAxios.get(url)
  }

  async getPaymentValues(gradeId, year) {
    let url = `${myUrl(3000)}/api/v1/payment-values?gradeId=${gradeId}&year=${year}`

    return customAxios.get(url)
  }

  async savePaymentValues(paymentValues) {
    let url = `${myUrl(3000)}/api/v1/payment-values`

    return customAxios.put(url, paymentValues)
  }

  async getPublicPreferences() {
    let url = `${myUrl(3000)}/api/v1/public-preferences`

    return customAxios.get(url)
  }
}