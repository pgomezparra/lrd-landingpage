<template>
  <VueFinalModal
    modal-id="createMovementModal"
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
      <p class="modal-title">Registrar movimiento</p>

      <div class="modal-body">
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
          <p>Tipo de movimiento</p>
          <select v-model="movement.movement_type_id">
            <option :value="1">Ingreso</option>
            <option :value="2">Salida</option>
          </select>
        </div>

        <div class="form-group">
          <p>Método de pago</p>
          <select v-model="movement.movement_method_id">
            <option :value="1">Efectivo</option>
            <option :value="2">Transferencia</option>
            <option :value="3">Cuenta Bancaria</option>
          </select>
        </div>

        <div class="form-group">
          <p>Descripción</p>
          <textarea
            v-model="movement.description"
            class="textarea-auto"
            placeholder="Descripción"
            rows="2"
            ref="description"
          ></textarea>
        </div>

        <div class="form-group">
          <p>Valor</p>
          <input
            v-model="movement.value"
            type="text"
            maxlength="10"
            placeholder="Valor"
          >
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="registerMovement">Registrar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { nextTick, reactive, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import Datepicker from '@vuepic/vue-datepicker'
import { notifications } from '@/shared/notifications.js'
import { useMovementStore } from '@/admin/movements/context/store/movementStore.js'

const vfm = useVfm()
const movementStore = useMovementStore()
const preferencesStore = usePreferenceStore()

const emit = defineEmits(['refresh'])

const description = ref(null)

const movement = reactive({
  date: new Date(),
  description: '',
  value: 0,
  movement_type_id: 0,
  movement_method_id: 0,
  year: 0
})

watch(
  () => [movement.movement_method_id, movement.movement_type_id],
  ([newMethodId, newTypeId], [oldMethodId, oldTypeId]) => {
    nextTick(() => {
      description.value?.focus()
    })
  }
)

const beforeOpen = () => {
  clearData()
  movement.date = new Date()
  movement.year = preferencesStore.selectedYear
  movement.movement_method_id = 1
  movement.movement_type_id = 2
}

const onOpened = () => {
  nextTick(() => {
    description.value?.focus()
  })
}

const clearData = () => {
  movement.date = new Date()
  movement.description = ''
  movement.value = 0
  movement.movement_type_id = 0
  movement.movement_method_id = 0
  movement.year = 0
}

const registerMovement = async () => {
  if (!validateData()) return

  try {
    const response = await movementStore.createMovement(movement)
    if (response.status === 201) {
      notifications.notify('El movimiento se ha registrado correctamente', 'success')
      closeModal()
      emit('refresh')
    } else if (response.status === 409) {
      notifications.notify(response.message, 'error')
    } else {
      notifications.notify('No se pudo registrar el movimiento', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
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

  if (movement.movement_type_id === 0) {
    notifications.notify('Debe seleccionar el tipo de movimiento', 'error')
    return false
  }

  return true
}

const onClosed = () => {
  clearData()
}

const closeModal = () => {
  vfm.close('createMovementModal')
}

</script>

<style scoped>
.modal-title {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group p {
  margin: 0 0 0.3rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.5rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.textarea-auto {
  resize: none;
  overflow: auto;
  min-height: 2.5rem;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.button-edit {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-edit:first-child {
  background-color: #6c757d;
  color: white;
}

.button-edit:last-child {
  background-color: #007bff;
  color: white;
}

.button-edit:hover {
  opacity: 0.9;
}
</style>