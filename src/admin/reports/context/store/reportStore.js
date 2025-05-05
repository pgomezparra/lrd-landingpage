import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import ReportUc from '@/admin/reports/use_cases/reportUc.js'
import ReportRepository from '@/admin/reports/models/repositories/reportRepository.js'

const reportRepository = new ReportRepository()
const reportUc = new ReportUc(reportRepository)

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
    }
  }
})