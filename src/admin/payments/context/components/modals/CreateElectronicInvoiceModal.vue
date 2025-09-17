<template>
  <VueFinalModal
    modal-id="createElectronicInvoiceModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @closed="onClosed"
  >
    <div>
      <p class="modal-title">Crear factura electrónica</p>
      <div class="modal-body">
        <div class="">
          <div class="form-group">
            <p>Servicio</p>
            <select class="select-methods" v-model="product">
              <option disabled value="">Seleccione un servicio</option>
              <option v-for="product in paymentsStore.externalProducts" :key="product.getCode()"
                      :value="product.getCode()">
                {{ product.getName() }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="sendToBill">Facturar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { ref } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'

const vfm = useVfm()
const preferenceStore = usePreferenceStore()
const paymentsStore = usePaymentStore()

const emit = defineEmits(['refresh', 'clear'])

const product = ref('')

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const validateData = () => {
  if (product.value === '') {
    notifications.notify('Debe seleccionar un servicio', 'error')
    return false
  }

  return true
}

const sendToBill = async () => {
  if (!validateData()) return

  const invoiceToCreate = {
    payment_id: props.data.id,
    identification: props.data.identification,
    product_code: product.value,
    price: parseInt(props.data.price),
    observations: props.data.observations
  }

  preferenceStore.setLoading(true)
  try {
    const response = await paymentsStore.createElectronicInvoice(invoiceToCreate)
    if (response.status === 201) {
      closeModal()
      emit('refresh')
      emit('clear')
    }
  } catch (error) {
    notifications.notify(error.response.data.message, 'error')
  } finally {
    preferenceStore.setLoading(false)
  }
}

const onClosed = () => {
  product.value = ''
}

const closeModal = () => {
  emit('clear')
  vfm.close('createElectronicInvoiceModal')
}
</script>
