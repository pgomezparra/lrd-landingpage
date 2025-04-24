<template>
  <VueFinalModal
    modal-id="createPaymentModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
    @opened="onOpened"
    @closed="onClosed"
  >
    <div>
      <div>
        <p>Registrar pago</p>
      </div>
      <div>
        <div>
          <p>Fecha</p>
          <Datepicker
            v-model="payment.date"
            :autoApply="true"
            :enable-time-picker="false"
            :format="'yyyy-MM-dd'"
            locale="es"
            :maxDate="new Date()"
            :clearable="false"
          />
        </div>
        <div>
          <p>Tipo de pago</p>
          <select disabled v-model="payment.payment_type_id">
            <option value="1">Matrícula</option>
            <option value="2">Pensión</option>
          </select>
        </div>
        <div v-if="payment.payment_type_id === 2">
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
        <div v-if="payment.payment_type_id === 2">
          <p>No paga</p>
          <input type="checkbox" v-model="payment.excluded">
        </div>
        <div>
          <p>Método de pago</p>
          <select :disabled="payment.excluded" v-model="payment.payment_method_id">
            <option value="1">Efectivo</option>
            <option value="2">Transferencia</option>
          </select>
        </div>
        <div>
          <p>Descripción</p>
          <input
            :value="payment.description"
            type="text"
            placeholder="Descripción"
            ref="description"
          >
        </div>
        <div>
          <p>Valor</p>
          <input
            :disabled="payment.excluded"
            v-model="payment.value"
            type="text"
            maxlength="10"
            placeholder="Valor"
          >
        </div>
        <div>
          <p>Saldo</p>
          <p>$ {{ balance < 0 ? 0 : balance }}</p>
        </div>
      </div>
      <button class="button-edit" @click="closeModal">
        Cancelar
      </button>
      <button class="button-edit" @click="registerPayment">
        Registrar
      </button>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import Datepicker from '@vuepic/vue-datepicker'
import { notifications } from '@/shared/notifications.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const paymentStore = usePaymentStore()
const preferencesStore = usePreferenceStore()

const props = defineProps({
  consolidatedPayments: {
    type: Array,
    required: true
  }
})

const balance = computed(() => {
  if (payment.excluded) return 0
  if (payment.value.toString().length < 4) return toPay.value.toLocaleString('es-CO')
  return (toPay.value - payment.value).toLocaleString('es-CO')
})

const description = ref(null)
const toPay = ref(0)

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

watch(
  () => [payment.excluded, payment.payment_method_id],
  ([newExcluded, newMethodId], [oldExcluded, oldMethodId]) => {

    nextTick(() => {
      description.value?.focus()
    })
  }
)

const beforeOpen = () => {
  clearData()
  payment.date = new Date().toISOString().split('T')[0]
  payment.student_id = studentStore.selectedStudent.getId()
  payment.year = preferencesStore.selectedYear
  payment.payment_method_id = 1

  for (const consolidated of props.consolidatedPayments) {
    if (consolidated.getBalance() > 0) {
      payment.payment_type_id = consolidated.getPaymentTypeId()
      toPay.value = consolidated.getBalance()
      if (consolidated.getPaymentTypeId() === 2) {
        payment.month_id = consolidated.getMonthId()
      } else {
        payment.month_id = new Date().getMonth() + 1
      }
      break
    }
  }
}

const onOpened = () => {
  nextTick(() => {
    description.value?.focus()
  })
}

const clearData = () => {
  payment.date = ''
  payment.description = ''
  payment.month_id = 0
  payment.value = 0
  payment.payment_type_id = 0
  payment.excluded = false
  payment.payment_method_id = 0
  payment.year = 0
  payment.student_id = 0
  toPay.value = 0
}

const registerPayment = async () => {
  console.log(payment)
  notifications.notify('Pago registrado', 'success')
}

const onClosed = () => {
  clearData()
}

const closeModal = () => {
  vfm.close('createPaymentModal')
}

</script>
