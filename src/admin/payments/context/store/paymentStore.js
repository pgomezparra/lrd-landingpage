import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import PaymentRepository from '@/admin/payments/models/repositories/paymentRepository.js'
import PaymentUc from '@/admin/payments/use_cases/paymentUc.js'

const paymentRepository = new PaymentRepository()
const paymentUc = new PaymentUc(paymentRepository)

const preferenceStore = usePreferenceStore()

export const usePaymentStore = defineStore('payments', {
  state: () => ({}),
  actions: {
    async searchPayments(studentId) {
      try {
        let year = preferenceStore.selectedYear ? preferenceStore.selectedYear : new Date().getFullYear()
        const response = await paymentUc.searchPayments(studentId, year)

        return markRaw(response.payments)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})