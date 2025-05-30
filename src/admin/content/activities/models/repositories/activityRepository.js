import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'
import { ACTIVITIES_PER_PAGE } from '@/admin/shared/constants.js'

export default class ActivityRepository {
  async searchActivities(filters, orders, page) {
    let url = `${myUrl(3000)}/api/v1/activities`

    const data = {
      filters: filters,
      orders: orders,
      limit: ACTIVITIES_PER_PAGE,
      offset: ACTIVITIES_PER_PAGE * (page - 1)
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