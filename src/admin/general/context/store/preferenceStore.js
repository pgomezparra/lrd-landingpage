import { defineStore } from 'pinia'
import PreferenceRepository from '@/admin/general/models/repositories/preferenceRepository.js'
import PreferenceUc from '@/admin/general/use_cases/preferenceUc.js'
import { markRaw } from 'vue'

const preferenceRepository = new PreferenceRepository()
const preferenceUc = new PreferenceUc(preferenceRepository)

export const usePreferenceStore = defineStore('preference', {
  state: () => ({
    years: [],
    selectedYear: null,
    grades: [],
    selectedGrade: null,
    months: [],
    selectedMonth: null
  }),
  actions: {
    setSelectedYear(year) {
      this.selectedYear = year
    },
    setSelectedGrade(grade) {
      this.selectedGrade = grade
    },
    async getYears() {
      try {
        const response = await preferenceUc.getYears()
        this.years = response.years

        if (this.years.length > 0) {
          this.selectedYear = this.years[0]
        }

        return response.status
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async getGrades() {
      try {
        const response = await preferenceUc.getGrades()
        this.grades = markRaw(response.grades)

        if (this.grades.length > 0) {
          this.selectedGrade = this.grades[0].getId()
        }

        return response.status
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async getMonths() {
      try {
        const response = await preferenceUc.getMonths()
        this.months = markRaw(response.months)

        if (this.months.length > 0) {
          this.selectedMonth = this.months[0].getId()
        }

        return response.status
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})