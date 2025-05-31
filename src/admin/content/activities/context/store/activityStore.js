import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import ActivityRepository from '@/admin/content/activities/models/repositories/activityRepository.js'
import ActivityUc from '@/admin/content/activities/use_cases/activityUc.js'
import { ACTIVITIES_PER_PAGE } from '@/admin/shared/constants.js'
import { NEWS_PER_PAGE } from '@/shared/constants.js'

const activityRepository = new ActivityRepository()
const activityUc = new ActivityUc(activityRepository)

export const useActivityStore = defineStore('activities', {
  state: () => ({
    selectedActivity: null,
    orders: [
      { order_by: 'updated_at', order_type: 'desc' }
    ],
    page: 1,
    total: 0,
    activities: []
  }),
  actions: {
    setSelectedActivity(activity) {
      if (activity === null) {
        this.selectedActivity = null
        return
      }
      this.selectedActivity = markRaw(activity)
    },
    setPage(page) {
      this.page = page
    },
    setTotal(total) {
      this.total = total
    },
    setActivities(activities) {
      this.activities = markRaw(activities)
    },
    async searchActivities() {
      try {
        const response = await activityUc.searchActivities([], this.orders, this.page, ACTIVITIES_PER_PAGE)

        this.setActivities(response.activities)
        this.setTotal(response.total)

        return response.status === 200
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async getPublicActivities(page) {
      try {
        return await activityUc.searchActivities([], this.orders, page, NEWS_PER_PAGE)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async createActivity(activity) {
      try {
        return await activityUc.createActivity(activity)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async updateActivity(activity) {
      try {
        return await activityUc.updateActivity(activity)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})