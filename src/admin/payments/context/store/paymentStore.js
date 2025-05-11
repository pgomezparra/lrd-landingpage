import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import PaymentRepository from '@/admin/payments/models/repositories/paymentRepository.js'
import PaymentUc from '@/admin/payments/use_cases/paymentUc.js'
import { notifications } from '@/shared/notifications.js'

const paymentRepository = new PaymentRepository()
const paymentUc = new PaymentUc(paymentRepository)

const preferenceStore = usePreferenceStore()

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    selectedPayment: null
  }),
  actions: {
    setSelectedPayment(payment) {
      if (payment === null) {
        this.selectedPayment = null
        return
      }
      this.selectedPayment = markRaw(payment)
    },
    async searchPayments(studentId, yearSearch = null) {
      try {
        let year = preferenceStore.selectedYear ? preferenceStore.selectedYear : new Date().getFullYear()
        if (yearSearch) year = yearSearch
        const response = await paymentUc.searchPayments(studentId, year)

        return { payments: markRaw(response.payments), consolidatedPayments: markRaw(response.consolidatedPayments) }
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async createPayment(payment) {
      try {
        return await paymentUc.createPayment(payment)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async updatePayment(payment) {
      try {
        return await paymentUc.updatePayment(payment)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async sendSupportPayment(student, consolidated) {
      try {
        const response = await paymentUc.sendSupportPayment(student, this.selectedPayment, consolidated)

        if (response.status === 200) {
          notifications.notify('Soporte de pago enviado', 'success')
        } else {
          notifications.notify(response.message, 'error')
        }
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})