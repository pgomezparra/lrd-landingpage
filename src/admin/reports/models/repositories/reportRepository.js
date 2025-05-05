import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class ReportRepository {
  async dailyCash(startDate, endDate) {
    let url = `${myUrl(3000)}/api/v1/daily-cash?startAt=${startDate}&endAt=${endDate}`

    return customAxios.get(url)
  }
}