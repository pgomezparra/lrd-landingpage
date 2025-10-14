import Grade from '@/admin/general/models/class/grade.js'
import Month from '@/admin/general/models/class/month.js'
import PaymentValue from '@/admin/general/models/class/paymentValue.js'
import PublicPreferences from '@/admin/general/models/class/publicPreferences.js'

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

  async saveYear(year) {
    try {
      const response = await this.#preferenceRepository.saveYear(year)

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data.message }
      } else {
        return { status: 500, message: 'Error al guardar el año' }
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

  async getPaymentValues(gradeId, year) {
    try {
      const response = await this.#preferenceRepository.getPaymentValues(gradeId, year)

      return {
        status: response.status,
        paymentValues: response.data.map(paymentValue => PaymentValue.fromJSONResponse(paymentValue))
      }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, paymentValues: [] }
      } else {
        return { status: 500, paymentValues: [] }
      }
    }
  }

  async savePaymentValues(paymentValues) {
    try {
      const data = []
      paymentValues.forEach(paymentValue => {
        data.push({
          grade_id: paymentValue.gradeId,
          year: paymentValue.year,
          registration: parseInt(paymentValue.registration),
          pension: parseInt(paymentValue.pension)
        })
      })
      const response = await this.#preferenceRepository.savePaymentValues(data)

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data.message }
      } else {
        return { status: 500, message: 'Error al guardar los valores de pago' }
      }
    }
  }

  async getPublicPreferences() {
    try {
      const response = await this.#preferenceRepository.getPublicPreferences()

      return { status: response.status, publicPreferences: PublicPreferences.fromJSONResponse(response.data) }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, publicPreferences: new PublicPreferences() }
      } else {
        return { status: 500, publicPreferences: new PublicPreferences() }
      }
    }
  }
}