import { defineStore } from 'pinia'
import PreferenceRepository from '@/admin/general/models/repositories/preferenceRepository.js'
import PreferenceUc from '@/admin/general/use_cases/preferenceUc.js'
import { markRaw } from 'vue'
import { notifications } from '@/shared/notifications.js'

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
    theme: 'light',
    selectedMenu: 'home',
    selectedSubMenu: '',
    loading: false,
    publicPreferences: null,
    privatePreferences: null
  }),

  actions: {
    initializePreferences() {
      const savedTheme = localStorage.getItem('app_theme') || 'light'
      this.applyTheme(savedTheme)

      this.selectedMenu = localStorage.getItem('selectedMenu') || 'home'
      this.selectedSubMenu = localStorage.getItem('selectedSubMenu') || ''
    },
    applyTheme(theme) {
      this.theme = theme
      document.body.classList.remove('light-mode', 'dark-mode')
      document.body.classList.add(`${theme}-mode`)
    },

    toggleTheme() {
      const newTheme = this.theme === 'dark' ? 'light' : 'dark'
      this.updateStateValue('theme', newTheme)
      this.applyTheme(newTheme)
    },
    updateStateValue(stateKey, value) {
      const key = `app_${stateKey}`
      localStorage.setItem(key, value)
    },
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

    setLoading(loading) {
      this.loading = loading
    },

    async getYears() {
      try {
        const response = await preferenceUc.getYears()
        this.years = response.years

        if (this.years.length > 0) {
          const currentYear = new Date().getFullYear()
          this.selectedYear = this.years.includes(currentYear) ? currentYear : this.years[0]
        }

        return response.status
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },

    async saveYear() {
      try {
        const response = await preferenceUc.saveYear(this.selectedYear)
        if (response.status === 201) {
          notifications.notify('Año creado correctamente', 'success')
          await this.getYears()
        } else {
          notifications.notify(response.message, 'error')
        }

        return response.status === 201
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
    },

    async savePaymentValues(paymentValues) {
      try {
        const response = await preferenceUc.savePaymentValues(paymentValues)
        if (response.status === 200) {
          notifications.notify('Valores de pago actualizados correctamente', 'success')
        } else {
          notifications.notify(response.message, 'error')
        }
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },

    async getPublicPreferences() {
      try {
        const response = await preferenceUc.getPublicPreferences()
        this.publicPreferences = markRaw(response.publicPreferences)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },

    async getPreferences() {
      try {
        const response = await preferenceUc.getPreferences()
        this.publicPreferences = markRaw(response.publicPreferences)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },

    async savePreferences(publicPreferences, privatePreferences) {
      try {
        const response = await preferenceUc.savePreferences(publicPreferences, privatePreferences)
        if (response.status === 200) {
          notifications.notify('Preferencias actualizadas correctamente', 'success')
        } else {
          notifications.notify(response.message, 'error')
        }
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})
