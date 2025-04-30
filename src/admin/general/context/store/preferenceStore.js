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
    selectedGrade: 0,
    months: [],
    selectedMonth: null,
    selectedMenu: '',
    selectedSubMenu: ''
  }),
  actions: {
    setSelectedYear(year) {
      this.selectedYear = year
    },
    setSelectedGrade(grade) {
      this.selectedGrade = grade
    },
    getSelectedMenu() {
      return localStorage.getItem('selectedMenu')
    },
    getSelectedSubMenu() {
      return localStorage.getItem('selectedSubMenu')
    },
    setSelectedMenu(menu) {
      this.selectedMenu = menu
      localStorage.setItem('selectedMenu', menu)
    },
    setSelectedSubMenu(subMenu) {
      this.selectedSubMenu = subMenu
      localStorage.setItem('selectedSubMenu', subMenu)
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

        return response.status
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async getMonths() {
      try {
        const response = await preferenceUc.getMonths()
        this.months = markRaw(response.months)

        return response.status
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async getPaymentValues(gradeId, year) {
      try {
        const response = await preferenceUc.getPaymentValues(gradeId, year)

        return markRaw(response.paymentValues)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})