import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import DashboardRepository from '@/admin/dashboard/models/repositories/dashboardRepository.js'
import DashboardUc from '@/admin/dashboard/use_cases/dashboardUc.js'
import { notifications } from '@/shared/notifications.js'

const dashboardRepository = new DashboardRepository()
const dashboardUc = new DashboardUc(dashboardRepository)

const preferenceStore = usePreferenceStore()

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({}),
  actions: {
    async getData() {
      try {
        const response = await dashboardUc.getConsolidated(preferenceStore.selectedYear)

        if (response.status !== 200) {
          notifications.notify('No se pudo obtener los datos', 'error')
        }

        return { success: response.status === 200, consolidated: markRaw(response.consolidated) }
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})