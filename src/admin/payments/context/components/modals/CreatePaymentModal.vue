<template>
  <VueFinalModal
    modal-id="createPaymentModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
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
      <p class="modal-title">Registrar pago</p>
      <div class="modal-body">
        <p>Estudiante: <b>{{ studentStore.selectedStudent.getName() }} {{ studentStore.selectedStudent.getSurname()
          }}</b> ({{ studentStore.selectedStudent.getGrade() }})
        </p>
        <div class="container-form-edit">
          <div class="form-group">
            <p>Fecha</p>
            <Datepicker
              v-model="payment.date"
              :autoApply="true"
              :enable-time-picker="false"
              format="yyyy-MM-dd"
              locale="es"
              :maxDate="new Date()"
              :clearable="false"
              :dark="theme === 'dark'"
            />
          </div>
          <div class="form-group">
            <p>Tipo de pago</p>
            <CustomSelect
              v-model="payment.payment_type_id"
              :options="paymentTypeOptions"
              :disabled="true"
            />
          </div>
        </div>
        <div class="container-form-edit">
          <div v-if="payment.payment_type_id === 2" class="form-group">
            <p>Mes</p>
            <CustomSelect
              v-model="payment.month_id"
              :options="monthOptions"
              placeholder="Mes"
              :disabled="true"
            />
          </div>
          <div v-if="payment.payment_type_id === 2" class="form-group switch-group">
            <p>No paga</p>
            <label class="switch">
              <input
                type="checkbox"
                role="switch"
                aria-label="No paga"
                :aria-checked="payment.excluded"
                v-model="payment.excluded"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="container-form-edit">
          <div class="form-group">
            <p>Método de pago</p>
            <CustomSelect
              v-model="payment.payment_method_id"
              :options="paymentMethodOptions"
              placeholder="Método de pago"
              :disabled="payment.excluded"
            />
          </div>
          <div v-if="payment.payment_method_id === 2" class="form-group">
            <p>Código de transferencia</p>
            <input
              v-model="payment.transfer_code"
              type="text"
              placeholder="Código de transferencia"
              ref="transferCode"
            />
          </div>
        </div>
        <div class="form-group">
          <p>Descripción</p>
          <textarea
            v-model="payment.description"
            placeholder="Descripción"
            rows="2"
            class="textAreaPayment"
            ref="description"
          ></textarea>
        </div>
        <div class="form-group">
          <p>Valor (Saldo: $ {{ parseInt(balance) < 0 ? 0 : balance }})</p>
          <CurrencyInput
            v-model="payment.value"
            :disabled="payment.excluded"
            placeholder="Valor"
          />
        </div>
      </div>
      <div class="modal-actions">
        <button class="button-standard button-edit" @click="closeModal">Cancelar</button>
        <button class="button-standard button-edit" @click="registerPayment">Registrar</button>
      </div>
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
import CurrencyInput from '@/admin/shared/components/CurrencyInput.vue'
import CustomSelect from '@/admin/shared/components/CustomSelect.vue'
import { notifications } from '@/shared/notifications.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const paymentStore = usePaymentStore()
const preferencesStore = usePreferenceStore()
const theme = computed(() => preferencesStore.theme)
const props = defineProps({
  consolidatedPayments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['refresh'])

const balance = computed(() => {
  if (payment.excluded) return 0
  if (payment.value.toString().length < 4) return toPay.value.toLocaleString('es-CO')
  return (toPay.value - payment.value).toLocaleString('es-CO')
})

const description = ref(null)
const transferCode = ref(null)
const toPay = ref(0)

const paymentTypeOptions = [
  { value: 1, label: 'Matrícula' },
  { value: 2, label: 'Pensión' }
]

const paymentMethodOptions = [
  { value: 1, label: 'Efectivo' },
  { value: 2, label: 'Transferencia' }
]

const monthOptions = computed(() =>
  preferencesStore.months.map((month) => ({
    value: month.getId(),
    label: month.getMonth()
  }))
)

const payment = reactive({
  date: new Date(),
  description: '',
  month_id: 0,
  value: 0,
  payment_type_id: 0,
  excluded: false,
  payment_method_id: 0,
  transfer_code: '',
  year: 0,
  student_id: 0
})

watch(
  () => payment.payment_method_id,
  (newMethodId) => {
    nextTick(() => {
      newMethodId === 2 ? transferCode.value?.focus() : description.value?.focus()
    })
  }
)

const beforeOpen = () => {
  clearData()
  payment.date = new Date()
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
  if (props.consolidatedPayments[props.consolidatedPayments.length - 1].getBalance() === 0) {
    closeModal()
    notifications.notify('El estudiante no tiene saldo pendiente', 'error')
    return
  }

  nextTick(() => {
    description.value?.focus()
  })
}

const clearData = () => {
  payment.date = new Date()
  payment.description = ''
  payment.month_id = 0
  payment.value = 0
  payment.payment_type_id = 0
  payment.excluded = false
  payment.payment_method_id = 0
  payment.year = 0
  payment.student_id = 0
  payment.transfer_code = ''
  toPay.value = 0
}

const registerPayment = async () => {
  if (!validateData()) return

  if (payment.payment_method_id !== 2) payment.transfer_code = ''

  preferencesStore.setLoading(true)
  try {
    const response = await paymentStore.createPayment(payment)
    if (response.status === 201) {
      notifications.notify('El pago se ha registrado correctamente', 'success')
      closeModal()
      emit('refresh')
    } else if (response.status === 409) {
      notifications.notify(response.message, 'error')
    } else {
      notifications.notify('No se pudo registrar el pago', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferencesStore.setLoading(false)
  }
}

const validateData = () => {
  if (payment.date === '') {
    notifications.notify('Debe ingresar la fecha del pago', 'error')
    return false
  }

  if (payment.description === '') {
    notifications.notify('Debe ingresar la descripción del pago', 'error')
    return false
  }

  if ((payment.value === '0' || payment.value === '' || payment.value === 0) && !payment.excluded) {
    notifications.notify('Debe ingresar el valor del pago', 'error')
    return false
  }

  if (parseInt(payment.value) > parseInt(toPay.value)) {
    notifications.notify('El valor del pago no puede ser mayor al saldo', 'error')
    return false
  }

  if (payment.payment_type_id === 0) {
    notifications.notify('Debe seleccionar el tipo de pago', 'error')
    return false
  }

  if (payment.payment_type_id === 2 && payment.month_id === 0) {
    notifications.notify('Debe seleccionar el mes del pago', 'error')
    return false
  }

  if (payment.payment_method_id === 2 && payment.transfer_code === '') {
    notifications.notify('Debe ingresar el código de transferencia', 'error')
    return false
  }

  return true
}

const onClosed = () => {
  clearData()
}

const closeModal = () => {
  vfm.close('createPaymentModal')
}

</script>

