import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import ReportUc from '@/admin/reports/use_cases/reportUc.js'
import ReportRepository from '@/admin/reports/models/repositories/reportRepository.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const reportRepository = new ReportRepository()
const reportUc = new ReportUc(reportRepository)

const preferenceStore = usePreferenceStore()

export const useReportStore = defineStore('reports', {
  state: () => ({}),
  actions: {
    async dailyCash(startDate, endDate) {
      try {
        const response = await reportUc.dailyCash(startDate, endDate)

        return { consolidated: markRaw(response.consolidated), movements: markRaw(response.movements) }
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async getDebtors(month, gradeId, paymentType) {
      try {
        const response = await reportUc.getDebtors(preferenceStore.selectedYear, month, gradeId, paymentType)

        return { debtors: markRaw(response.debtors), consolidated: markRaw(response.consolidated) }
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})