import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class ActivityRepository {
  async searchActivities(filters, orders, page, limit) {
    let url = `${myUrl(3000)}/api/v1/activities`

    const data = {
      filters: filters,
      orders: orders,
      limit: limit,
      offset: limit * (page - 1)
    }

    url += `?criteria=${JSON.stringify(data).replace(/#/g, '%23')}`

    return customAxios.get(url)
  }

  async createActivity(activity) {
    let url = `${myUrl(3000)}/api/v1/activities`

    return customAxios.post(url, activity)
  }

  async updateActivity(activity) {
    let url = `${myUrl(3000)}/api/v1/activities/${activity.id}`

    return customAxios.patch(url, activity)
  }
}