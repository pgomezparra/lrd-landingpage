<template>
  <VueFinalModal
    modal-id="editMovementModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpened"
    @opened="onOpened"
    @closed="onClosed"
  >
    <div>
      <p class="modal-title">Editar pago</p>

      <div class="modal-body">
        <div class="container-form-edit">
          <div class="form-group">
            <p>Fecha</p>
            <Datepicker
              v-model="movement.date"
              :autoApply="true"
              :enable-time-picker="false"
              :format="'yyyy-MM-dd'"
              locale="es"
              :maxDate="new Date()"
              :clearable="false"
            />
          </div>
          <div class="form-group">
            <p>Tipo de pago</p>
            <select class="select-methods" v-model="movement.movement_type_id">
              <option :value="1">Ingreso</option>
              <option :value="2">Salida</option>
            </select>
          </div>
        </div>
        <div class="container-form-edit">
          <div class="form-group">
            <p>Método de pago</p>
            <select class="select-methods" v-model="movement.movement_method_id">
              <option :value="1">Efectivo</option>
              <option :value="2">Transferencia</option>
              <option :value="3">Cuenta Bancaria</option>
            </select>
          </div>
          <div class="form-group">
            <p>Valor</p>
            <input
              v-model="movement.value"
              type="text"
              placeholder="Valor"
              ref="inputValue"
              @keyup.enter="focusOnDescription"
            />
          </div>
        </div>


        <div class="form-group">
          <p>Descripción</p>
          <textarea
            v-model="movement.description"
            class="textAreaPayment"
            placeholder="Descripción"
            rows="2"
            ref="description"
          ></textarea>
        </div>


        <div class="form-group">
          <p>
            Autor: <span>{{ movement.author }}</span>
          </p>
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
import { nextTick, reactive, ref, watch } from 'vue'
import { parse } from '@formkit/tempo'
import Datepicker from '@vuepic/vue-datepicker'
import { notifications } from '@/shared/notifications.js'
import { useMovementStore } from '@/admin/movements/context/store/movementStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const vfm = useVfm()
const movementStore = useMovementStore()
const preferenceStore = usePreferenceStore()

const description = ref(null)
const inputValue = ref(null)

const movement = reactive({
  id: 0,
  date: new Date(),
  description: '',
  value: 0,
  movement_type_id: 0,
  movement_method_id: 0,
  year: 0,
  author: ''
})

const emit = defineEmits(['refresh'])

watch(
  () => [movement.movement_type_id, movement.movement_method_id],
  ([newTypeId, newMethodId], [oldTypeId, oldMethodId]) => {
    nextTick(() => {
      description.value?.focus()
    })
  }
)

const focusOnDescription = () => {
  description.value?.focus()
}

const updatePayment = async () => {
  if (!validateData()) return

  preferenceStore.setLoading(true)
  try {
    const response = await movementStore.updateMovement(movement)
    if (response.status === 200) {
      notifications.notify('El movimiento se ha actualizado correctamente', 'success')
      closeModal()
      emit('refresh')
    } else if (response.status === 409) {
      notifications.notify(response.message, 'error')
    } else {
      notifications.notify('No se pudo actualizar el movimiento', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const validateData = () => {
  if (movement.date === '') {
    notifications.notify('Debe ingresar la fecha del movimiento', 'error')
    return false
  }

  if (movement.description === '') {
    notifications.notify('Debe ingresar la descripción del movimiento', 'error')
    return false
  }

  if (movement.value === '0' || movement.value === '' || movement.value === 0) {
    notifications.notify('Debe ingresar el valor del movimiento', 'error')
    return false
  }

  return true
}

const onOpened = () => {
  inputValue.value?.focus()
}

const beforeOpened = () => {
  if (!movementStore.selectedMovement) return
  movement.id = movementStore.selectedMovement.getId()
  movement.date = parse(movementStore.selectedMovement.getDate(), 'YYYY-MM-DD')
  movement.description = movementStore.selectedMovement.getDescription()
  movement.value = movementStore.selectedMovement.getValue()
  movement.movement_type_id = movementStore.selectedMovement.getMovementTypeId()
  movement.movement_method_id = movementStore.selectedMovement.getMovementMethodId()
  movement.year = movement.date.getFullYear()
  movement.author = movementStore.selectedMovement.getAuthor()
}

const onClosed = () => {
  movementStore.setSelectedMovement(null)
  movement.id = 0
  movement.date = new Date()
  movement.description = ''
  movement.value = 0
  movement.movement_type_id = 0
  movement.movement_method_id = 0
  movement.year = 0
  movement.author = ''
}

const closeModal = () => {
  vfm.close('editMovementModal')
}
</script>


