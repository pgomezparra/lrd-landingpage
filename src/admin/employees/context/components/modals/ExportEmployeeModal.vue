<template>
  <VueFinalModal
    modal-id="exportEmployeeModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
  >
    <div>
      <p class="modal-title">Exportar planilla de empleados</p>
      <div class="modal-body">
        <div class="form-group">
          <p>Mes</p>
          <select class="select-document" v-model="month">
            <option disabled :value="0">Seleccione el mes</option>
            <option
              v-for="item in preferenceStore.months"
              :key="item.getId()"
              :value="item.getMonth()"
            >
              {{ item.getMonth() }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <p>Tipo de empleado</p>
          <div class="checkbox-group">
            <label>
              <input
                type="checkbox"
                :value="true"
                v-model="selectAll"
              />
              Todos
            </label>
          </div>
          <div
            v-for="(item, index) in EMPLOYEE_TYPES"
            :key="index"
            class="checkbox-group"
          >
            <label>
              <input
                type="checkbox"
                :value="index"
                v-model="types"
              />
              {{ item }}
            </label>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="exportEmployees">Exportar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { computed, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { EMPLOYEE_TYPES } from '@/admin/shared/constants.js'
import { useEmployeeStore } from '@/admin/employees/context/store/employeeStore.js'
import { notifications } from '@/shared/notifications.js'

const vfm = useVfm()
const employeeStore = useEmployeeStore()
const preferenceStore = usePreferenceStore()
const theme = computed(() => preferenceStore.theme)
const selectAll = ref(false)

const props = defineProps({
  statusFilter: {
    type: String,
    required: true
  }
})

const month = ref(0)
const types = ref([])

watch(() => selectAll.value, (newValue) => {
  if (newValue) {
    types.value = Object.keys(EMPLOYEE_TYPES)
  } else {
    types.value = []
  }
})

const beforeOpen = () => {
  selectAll.value = false
  month.value = 0
  types.value = []
}

const closeModal = () => {
  vfm.close('exportEmployeeModal')
}

async function exportEmployees() {
  if (month.value === 0) {
    notifications.notify('Debe seleccionar el mes', 'error')
    return
  }

  if (types.value.length === 0) {
    notifications.notify('Debe seleccionar al menos un tipo de empleado', 'error')
    return
  }

  preferenceStore.setLoading(true)
  try {
    const success = await employeeStore.exportEmployees(props.statusFilter === 'active', month.value, types.value)
    if (success) closeModal()
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}
</script>
