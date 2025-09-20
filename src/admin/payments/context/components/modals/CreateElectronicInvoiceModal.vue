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
      <p class="modal-title">Crear factura</p>
      <div class="modal-body">
        <div class="">
          <div class="form-group">
            <p>Tipo</p>
            <div>
              <label>
                <input type="radio" value="electronic" v-model="type" />
                Electrónica
              </label>
              <label>
                <input type="radio" value="non-electronic" v-model="type" />
                No electrónica
              </label>
            </div>
          </div>
          <div class="form-group">
            <p>Servicio</p>
            <select :disabled="type === 'non-electronic'" class="select-methods" v-model="product">
              <option disabled value="">Seleccione un servicio</option>
              <option v-for="product in paymentsStore.externalProducts" :key="product.getCode()"
                      :value="product.getCode()">
                {{ product.getName() }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <p>Cantidad (opcional)</p>
            <input
              type="text"
              inputmode="numeric"
              @input="quantity = quantity.replace(/[^0-9]/g, '')"
              placeholder="Cantidad a facturar"
              v-model="quantity"
              :disabled="type === 'non-electronic'"
            />
          </div>
          <div class="form-group">
            <p>Valor unitario (opcional)</p>
            <input
              type="text"
              inputmode="numeric"
              @input="price = price.replace(/[^0-9]/g, '')"
              placeholder="Valor a facturar"
              v-model="price"
              :disabled="type === 'non-electronic'"
            />
          </div>
          <div class="form-group">
            <p>Observación (opcional)</p>
            <input
              type="text"
              placeholder="Observación"
              v-model="observations"
              maxlength="40"
              :disabled="type === 'non-electronic'"
            />
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="selectAction">Facturar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'

const vfm = useVfm()
const preferenceStore = usePreferenceStore()
const paymentsStore = usePaymentStore()

const emit = defineEmits(['refresh', 'clear'])

const product = ref('')
const quantity = ref('')
const price = ref('')
const observations = ref('')
const type = ref('electronic')

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

watch(type, () => {
  if (type.value === 'non-electronic') clearData()
})

const validateData = () => {
  if (product.value === '') {
    notifications.notify('Debe seleccionar un servicio', 'error')
    return false
  }

  if (quantity.value !== '' && parseInt(quantity.value) === 0) {
    notifications.notify('La cantidad no puede ser 0', 'error')
    return
  }

  if (price.value !== '' && parseInt(price.value) === 0) {
    notifications.notify('El valor no puede ser 0', 'error')
    return
  }

  return true
}

const selectAction = async () => {
  if (type.value === 'non-electronic') {
    await sendToNoElectronicBill()
  } else {
    await sendToBill()
  }
}

const sendToBill = async () => {
  if (!validateData()) return

  const invoiceToCreate = {
    payment_id: props.data.id,
    identification: props.data.identification,
    product_code: product.value,
    price: parseInt(props.data.price),
    observations: props.data.observations,
    quantity: 1
  }

  if (quantity.value !== '' || price.value !== '' || observations.value !== '') {
    if (quantity.value !== '' && price.value !== '' && observations.value !== '') {
      invoiceToCreate.quantity = parseInt(quantity.value)
      invoiceToCreate.price = parseInt(price.value)
      invoiceToCreate.observations = observations.value
    } else {
      notifications.notify('Debe rellenar todos los campos', 'error')
      return
    }
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

const sendToNoElectronicBill = async () => {
  preferenceStore.setLoading(true)
  try {
    const response = await paymentsStore.markAsBilled(props.data.id)
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

const clearData = () => {
  product.value = ''
  quantity.value = ''
  price.value = ''
  observations.value = ''
}

const onClosed = () => {
  clearData()
  type.value = 'electronic'
}

const closeModal = () => {
  emit('clear')
  vfm.close('createElectronicInvoiceModal')
}
</script>
