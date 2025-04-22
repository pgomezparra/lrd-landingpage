<template>
  <VueFinalModal
    modal-id="editPaymentModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="onOpened"
    @closed="onClosed"
  >
    <div>
      <div>
        <p>Editar pago</p>
      </div>
      <div>
        <div>
          <p>Descripción</p>
          <input
            :value="payment.description"
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div v-if="paymentStore.selectedPayment.isPension()">
          <p>Mes</p>
          <select disabled v-model="payment.month_id">
            <option
              v-for="month in preferencesStore.months"
              :key="month.getId()"
              :value="month.getId()"
            >
              {{ month.getMonth() }}
            </option>
          </select>
        </div>
        <div>
          <p>Valor</p>
          <input
            v-model="payment.value"
            type="text"
            placeholder="Apellido"
          >
        </div>
        <div>
          <p>Tipo de pago</p>
          <select disabled v-model="payment.payment_type_id">
            <option value="1">Matrícula</option>
            <option value="2">Pensión</option>
          </select>
        </div>
        <div v-if="paymentStore.selectedPayment.isPension()">
          <p>No paga</p>
          <input type="checkbox" v-model="payment.excluded">
        </div>
        <div>
          <p>Método de pago</p>
          <select v-model="payment.payment_method_id">
            <option value="1">Efectivo</option>
            <option value="2">Transferencia</option>
          </select>
        </div>
      </div>
      <button class="button-edit" @click="closeModal">
        Cancelar
      </button>
      <button class="button-edit" @click="closeModal">
        Actualizar
      </button>

    </div>


  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { reactive } from 'vue'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const paymentStore = usePaymentStore()
const preferencesStore = usePreferenceStore()

const payment = reactive({
  date: '',
  description: '',
  month_id: 0,
  value: 0,
  payment_type_id: 0,
  excluded: false,
  payment_method_id: 0,
  year: 0,
  student_id: 0
})

const onOpened = () => {
  payment.date = paymentStore.selectedPayment.getDate()
  payment.description = paymentStore.selectedPayment.getDescription()
  payment.month_id = paymentStore.selectedPayment.getMonthId()
  payment.value = paymentStore.selectedPayment.getValue()
  payment.payment_type_id = paymentStore.selectedPayment.getPaymentTypeId()
  payment.excluded = paymentStore.selectedPayment.isExcluded()
  payment.payment_method_id = paymentStore.selectedPayment.getPaymentMethodId()
  payment.year = studentStore.selectedStudent.getYear()
  payment.student_id = studentStore.selectedStudent.getId()
}

const onClosed = () => {
  paymentStore.setSelectedPayment(null)
  payment.date = ''
  payment.description = ''
  payment.month_id = 0
  payment.value = 0
  payment.payment_type_id = 0
  payment.excluded = false
  payment.payment_method_id = 0
  payment.year = 0
  payment.student_id = 0
}

const closeModal = () => {
  vfm.close('editPaymentModal')
}

</script>
