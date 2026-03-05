<template>
  <VueFinalModal
    modal-id="createEmployeeModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
    content-class="confirm-modal__content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
    @opened="onOpen"
  >
    <div>
      <p class="modal-title">Registrar empleado</p>
      <div class="modal-body">
        <div class="container-form-edit">
          <div class="form-group">
            <p>Tipo de documento</p>
            <select class="select-methods" v-model="employee.documentType" ref="documentTypeInput"
                    @change="focusDocumentInput">
              <option disabled value="">Seleccione un tipo de documento</option>
              <option
                v-for="(documentType, index) in DOCUMENT_TYPES_TEXT"
                :key="index"
                :value="index"
              >
                {{ documentType }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <p>Documento</p>
            <input
              v-model="employee.document"
              ref="documentInput"
              type="text"
              placeholder="Documento"
              @blur="validateDocument"
            >
          </div>
        </div>
        <div class="form-group">
          <p>Nombres</p>
          <input
            v-model="employee.name"
            type="text"
            placeholder="Nombres"
            maxlength="25"
          />
        </div>
        <div class="form-group">
          <p>Apellidos</p>
          <input
            v-model="employee.surname"
            type="text"
            placeholder="Apellidos"
            maxlength="25"
          />
        </div>
        <div class="form-group">
          <p>Salario</p>
          <input
            type="text"
            placeholder="Salario"
            v-model="employee.salary"
            maxlength="40"
          />
        </div>
        <div class="form-group">
          <p>Tipo de empleado</p>
          <select class="select-methods" v-model="employee.type">
            <option disabled value="">Seleccione un tipo de empleado</option>
            <option
              v-for="(type, index) in EMPLOYEE_TYPES"
              :key="index"
              :value="index">
              {{ type }}
            </option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="registerEmployee">Guardar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { computed, reactive, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import * as utils from '@/shared/utils.js'
import { notifications } from '@/shared/notifications.js'
import { useEmployeeStore } from '@/admin/employees/context/store/employeeStore.js'
import { DOCUMENT_TYPES_TEXT, EMPLOYEE_TYPES } from '@/admin/shared/constants.js'

const vfm = useVfm()
const employeeStore = useEmployeeStore()
const preferenceStore = usePreferenceStore()
const theme = computed(() => preferenceStore.theme)

const emit = defineEmits(['changeActive', 'refresh'])

const documentTypeInput = ref(null)
const documentInput = ref(null)

const employee = reactive({
  name: '',
  surname: '',
  documentType: '',
  document: '',
  active: true,
  year: preferenceStore.selectedYear,
  salary: 3,
  type: '',
  id: ''
})

watch(
  () => employee.document,
  async (newValue) => {
    if (!newValue) return
    employee.document = utils.onlyNumbers(newValue)
  }
)

watch(
  () => employee.salary,
  async (newValue) => {
    if (!newValue) return 0
    employee.salary = utils.onlyNumbers(newValue)
  }
)

const beforeOpen = async () => {
  clearInputs()
}

const onOpen = () => {
  documentTypeInput.value.focus()
}

const focusDocumentInput = () => {
  documentInput.value.focus()
}

const validateDocument = async () => {
  try {
    if (!employee.document) return

    const response = await employeeStore.searchByDocument(employee.document)
    if (response.status === 200) {
      const employees = response.employees
      if (employees.length === 0) {
        return
      }

      const year = employees[0].getYear()
      if (year === preferenceStore.selectedYear) {
        notifications.notify('El empleado ya se encuentra en el año actual', 'warning')
        closeModal()
        return
      }

      employee.documentType = employees[0].getDocumentType()
      employee.name = employees[0].getName()
      employee.surname = employees[0].getSurname()
      employee.type = employees[0].getEmployeeType()
    } else {
      notifications.notify('No se pudo validar el empleado', 'error')
      closeModal()
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const registerEmployee = async () => {
  if (!validateData()) return

  preferenceStore.setLoading(true)
  try {
    const response = await employeeStore.registerEmployee(employee)
    if (response.status === 201) {
      notifications.notify('El empleado se ha registrado correctamente', 'success')
      closeModal()
      emit('changeActive')
      emit('refresh')
    } else {
      notifications.notify('No se pudo registrar el empleado', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const validateData = () => {
  if (employee.documentType === '') {
    notifications.notify('Debe seleccionar el tipo de documento del empleado', 'error')
    return false
  }

  if (employee.document === '') {
    notifications.notify('El documento del empleado no puede estar vacío', 'error')
    return false
  }

  if (employee.name === '') {
    notifications.notify('El nombre del empleado no puede estar vacío', 'error')
    return false
  }

  if (employee.surname === '') {
    notifications.notify('El apellido del empleado no puede estar vacío', 'error')
    return false
  }

  if (employee.type === '') {
    notifications.notify('Debe seleccionar el tipo de empleado', 'error')
    return false
  }

  return true
}

const clearInputs = () => {
  employee.name = ''
  employee.surname = ''
  employee.documentType = ''
  employee.document = ''
  employee.year = preferenceStore.selectedYear
  employee.active = true
  employee.salary = 0
  employee.type = ''
  employee.id = ''
}

const closeModal = () => {
  vfm.close('createEmployeeModal')
}
</script>

