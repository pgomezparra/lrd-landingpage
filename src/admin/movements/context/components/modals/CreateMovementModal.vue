<template>
  <VueFinalModal
    modal-id="createMovementModal"
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
      <p class="modal-title">Registrar movimiento</p>

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
              :class="theme === 'dark' ? 'dp__theme_dark' : ''"
            />
          </div>
          <div class="form-group">
            <p>Tipo de movimiento</p>
            <select class="select-document" v-model="movement.movement_type_id">
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
              maxlength="10"
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
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import Datepicker from '@vuepic/vue-datepicker'
import { notifications } from '@/shared/notifications.js'
import { useMovementStore } from '@/admin/movements/context/store/movementStore.js'

const vfm = useVfm()
const movementStore = useMovementStore()
const preferencesStore = usePreferenceStore()
const theme = computed(() => preferencesStore.theme)
const emit = defineEmits(['refresh'])

const description = ref(null)
const inputValue = ref(null)

const movement = reactive({
  date: new Date(),
  description: '',
  value: '',
  movement_type_id: 0,
  movement_method_id: 0,
  year: 0
})

watch(
  () => [movement.movement_method_id, movement.movement_type_id],
  ([newMethodId, newTypeId], [oldMethodId, oldTypeId]) => {
    nextTick(() => {
      inputValue.value?.focus()
    })
  }
)

const focusOnDescription = () => {
  description.value?.focus()
}

const beforeOpen = () => {
  clearData()
  movement.date = new Date()
  movement.year = preferencesStore.selectedYear
  movement.movement_method_id = 1
  movement.movement_type_id = 2
}

const onOpened = () => {
  nextTick(() => {
    inputValue.value?.focus()
  })
}

const clearData = () => {
  movement.date = new Date()
  movement.description = ''
  movement.value = ''
  movement.movement_type_id = 0
  movement.movement_method_id = 0
  movement.year = 0
}

const registerMovement = async () => {
  if (!validateData()) return

  preferencesStore.setLoading(true)
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
  } finally {
    preferencesStore.setLoading(false)
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
