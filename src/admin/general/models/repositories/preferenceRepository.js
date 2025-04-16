import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class PreferenceRepository {
  async getYears() {
    let url = `${myUrl(3000)}/api/v1/years`

    return customAxios.get(url)
  }

  async getGrades() {
    let url = `${myUrl(3000)}/api/v1/grades`

    return customAxios.get(url)
  }

  async getMonths() {
    let url = `${myUrl(3000)}/api/v1/months`

    return customAxios.get(url)
  }
}