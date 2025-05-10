import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class DashboardRepository {
  async getConsolidated(year) {
    let url = `${myUrl(3000)}/api/v1/dashboard/${year}`

    return customAxios.get(url)
  }
}