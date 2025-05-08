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
      <p class="modal-title">Registrar pago</p>
      <div class="modal-body">
        <div>
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
              />
            </div>
            <div class="form-group">
              <p>Tipo de pago</p>
              <select class="select-methods" v-model="payment.payment_type_id" disabled>
                <option value="1">Matrícula</option>
                <option value="2">Pensión</option>
              </select>
            </div>
          </div>
        </div>
        <div class="container-form-edit">
          <div v-if="payment.payment_type_id === 2" class="form-group">
            <p>Mes</p>
            <select class="select-methods" v-model="payment.month_id" disabled>
              <option
                v-for="month in preferencesStore.months"
                :key="month.getId()"
                :value="month.getId()"
              >
                {{ month.getMonth() }}
              </option>
            </select>
          </div>
          <div v-if="payment.payment_type_id === 2" class="form-group switch-group">
            <p>No paga</p>
            <label class="switch">
              <input type="checkbox" v-model="payment.excluded" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="container-form-edit">
          <div class="form-group">
            <p>Método de pago</p>
            <select class="select-methods" :disabled="payment.excluded" v-model="payment.payment_method_id">
              <option :value="1">Efectivo</option>
              <option :value="2">Transferencia</option>
            </select>
          </div>
          <div class="form-group">
            <p>Valor</p>
            <input
              :disabled="payment.excluded"
              v-model="payment.value"
              type="text"
              maxlength="10"
              placeholder="Valor"
            />
          </div>
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
        <div class="form-group">
          <p>Descripción</p>
          <textarea
            v-model="payment.description"
            placeholder="Descripción"
            rows="2"
            style="resize: none; overflow: auto"
            ref="description"
          ></textarea>
        </div>
        <div class="form-group">
          <p>Saldo</p>
          <p>$ {{ balance < 0 ? 0 : balance }}</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="registerPayment">Registrar</button>
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

const emit = defineEmits(['refresh'])

const balance = computed(() => {
  if (payment.excluded) return 0
  if (payment.value.toString().length < 4) return toPay.value.toLocaleString('es-CO')
  return (toPay.value - payment.value).toLocaleString('es-CO')
})

const description = ref(null)
const transferCode = ref(null)
const toPay = ref(0)

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
  () => [payment.excluded, payment.payment_method_id],
  ([newExcluded, newMethodId], [oldExcluded, oldMethodId]) => {
    if (newExcluded) {
      payment.payment_method_id = 1
      payment.transfer_code = ''
    }
    if (newMethodId === 1) {
      payment.transfer_code = ''
    }

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
  toPay.value = 0
}

const registerPayment = async () => {
  if (!validateData()) return

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

