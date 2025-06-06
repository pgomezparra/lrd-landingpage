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
      <p class="modal-title">Editar pago</p>
      <div class="modal-body">
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
            <select class="select-methods" disabled v-model="payment.payment_type_id">
              <option value="1">Matrícula</option>
              <option value="2">Pensión</option>
            </select>
          </div>
        </div>

        <div class="container-form-edit">
          <div v-if="paymentStore.selectedPayment.isPension()" class="form-group">
            <p>Mes</p>
            <select class="select-methods" disabled v-model="payment.month_id">
              <option
                v-for="month in preferencesStore.months"
                :key="month.getId()"
                :value="month.getId()"
              >
                {{ month.getMonth() }}
              </option>
            </select>
          </div>
          <div v-if="paymentStore.selectedPayment.isPension()" class="form-group switch-group">
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
          <p>Valor</p>
          <input
            :disabled="payment.excluded"
            v-model="payment.value"
            type="text"
            maxlength="10"
            placeholder="Valor"
          />
        </div>
        <div class="form-group">
          <p>Autor: <span>{{ payment.author }}</span></p>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="updatePayment">Actualizar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { nextTick, reactive, ref, watch } from 'vue'
import { parse } from '@formkit/tempo'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import Datepicker from '@vuepic/vue-datepicker'
import { notifications } from '@/shared/notifications.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const paymentStore = usePaymentStore()
const preferencesStore = usePreferenceStore()

const transferCode = ref(null)
const description = ref(null)

const payment = reactive({
  id: 0,
  date: new Date(),
  description: '',
  month_id: 0,
  value: 0,
  payment_type_id: 0,
  excluded: false,
  payment_method_id: 0,
  year: 0,
  student_id: 0,
  transfer_code: '',
  author: ''
})

const emit = defineEmits(['refresh'])

watch(
  () => [payment.excluded, payment.payment_method_id],
  ([newExcluded, newMethodId], [oldExcluded, oldMethodId]) => {
    if (newExcluded) {
      payment.payment_method_id = 1
    }

    nextTick(() => {
      newMethodId === 2 ? transferCode.value?.focus() : description.value?.focus()
    })
  }
)

const updatePayment = async () => {
  if (!validateData()) return

  if (payment.payment_method_id !== 2) payment.transfer_code = ''
  if (payment.excluded) {
    payment.transfer_code = ''
    payment.value = 0
  }

  preferencesStore.setLoading(true)
  try {
    const response = await paymentStore.updatePayment(payment)
    if (response.status === 200) {
      notifications.notify('El pago se ha actualizado correctamente', 'success')
      closeModal()
      emit('refresh')
    } else if (response.status === 409) {
      notifications.notify(response.message, 'error')
    } else {
      notifications.notify('No se pudo actualizar el pago', 'error')
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

  if (payment.payment_method_id === 2 && payment.transfer_code === '') {
    notifications.notify('Debe ingresar el código de transferencia', 'error')
    return false
  }

  return true
}

const onOpened = () => {
  if (!paymentStore.selectedPayment) return
  payment.id = paymentStore.selectedPayment.getId()
  payment.date = parse(paymentStore.selectedPayment.getDate(), 'YYYY-MM-DD')
  payment.description = paymentStore.selectedPayment.getDescription()
  payment.month_id = paymentStore.selectedPayment.getMonthId()
  payment.value = paymentStore.selectedPayment.getValue()
  payment.payment_type_id = paymentStore.selectedPayment.getPaymentTypeId()
  payment.excluded = paymentStore.selectedPayment.isExcluded()
  payment.payment_method_id = paymentStore.selectedPayment.getPaymentMethodId()
  if (paymentStore.selectedPayment.getTransferCode()) payment.transfer_code = paymentStore.selectedPayment.getTransferCode()
  payment.year = studentStore.selectedStudent.getYear()
  payment.student_id = studentStore.selectedStudent.getId()
  payment.author = paymentStore.selectedPayment.getAuthor() ?? 'Automático'
}

const onClosed = () => {
  paymentStore.setSelectedPayment(null)
  payment.id = 0
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
  payment.author = ''
}

const closeModal = () => {
  vfm.close('editPaymentModal')
}
</script>
