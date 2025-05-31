import Activity from '@/admin/content/activities/models/class/activity.js'

export default class ActivityUc {
  #activityRepository = null

  constructor(activityRepository) {
    this.#activityRepository = activityRepository
  }

  async searchActivities(filters, orders, page, limit) {
    try {
      const response = await this.#activityRepository.searchActivities(filters, orders, page, limit)
      const activities = response.data?.activities?.map(activity => Activity.fromJSONResponse(activity))

      return { status: response.status, activities: activities, total: response.data?.total }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, activities: [], total: 0 }
      } else {
        return { status: 500, activities: [], total: 0 }
      }
    }
  }

  async createActivity(activity) {
    try {
      const response = await this.#activityRepository.createActivity(this.processActivity(activity))

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

  async updateActivity(activity) {
    try {
      const data = this.processUpdateActivity(activity)
      data.id = activity.id
      const response = await this.#activityRepository.updateActivity(data)

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

  processActivity(activity) {
    const formData = new FormData()
    formData.append('title', activity.title)
    formData.append('description', activity.description)

    activity.images.forEach((img) => {
      formData.append('photos', img.file)
    })

    return formData
  }

  processUpdateActivity(activity) {
    const formData = new FormData()
    formData.append('title', activity.title)
    formData.append('description', activity.description)
    activity.actualImages.forEach((img) => {
      formData.append('photos_to_keep', img)
    })

    activity.newImages.forEach((img) => {
      formData.append('photos', img.file)
    })

    return formData
  }
}