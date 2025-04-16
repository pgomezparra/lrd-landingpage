import Grade from '@/admin/general/models/class/grade.js'
import Month from '@/admin/general/models/class/month.js'

export default class PreferenceUc {
  #preferenceRepository = null

  constructor(preferenceRepository) {
    this.#preferenceRepository = preferenceRepository
  }

  async getYears() {
    try {
      const response = await this.#preferenceRepository.getYears()

      return { status: response.status, years: response.data }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, years: [] }
      } else {
        return { status: 500, years: [] }
      }
    }
  }

  async getGrades() {
    try {
      const response = await this.#preferenceRepository.getGrades()
      const grades = response.data.map(grade => Grade.fromJSONResponse(grade))

      return { status: response.status, grades: grades }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, grades: [] }
      } else {
        return { status: 500, grades: [] }
      }
    }
  }

  async getMonths() {
    try {
      const response = await this.#preferenceRepository.getMonths()
      const months = response.data.map(month => Month.fromJSONResponse(month))

      return { status: response.status, months: months }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, months: [] }
      } else {
        return { status: 500, months: [] }
      }
    }

  }
}