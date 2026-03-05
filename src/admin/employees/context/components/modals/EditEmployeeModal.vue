<template>
  <VueFinalModal
    modal-id="editEmployeeModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
  >
    <div>
      <p class="modal-title">Editar empleado</p>
      <div class="modal-body">
        <div class="container-form-edit">
          <div class="form-group">
            <p>Tipo de documento</p>
            <select class="select-document" v-model="employee.documentType">
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
            <input v-model="employee.document" type="text" placeholder="Documento" maxlength="20" />
          </div>
        </div>
        <div class="form-group">
          <p>Nombres</p>
          <input v-model="employee.name" type="text" placeholder="Nombre" maxlength="30" />
        </div>
        <div class="form-group">
          <p>Apellidos</p>
          <input v-model="employee.surname" type="text" placeholder="Apellido" maxlength="30" />
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
        <div class="container-form-edit">
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
          <div class="form-group">
            <p>Estado</p>
            <select class="select-document" v-model="employee.active">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="updateEmployee">Actualizar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { computed, reactive } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { DOCUMENT_TYPES_TEXT, EMPLOYEE_TYPES } from '@/admin/shared/constants.js'
import { useEmployeeStore } from '@/admin/employees/context/store/employeeStore.js'

const vfm = useVfm()
const employeeStore = useEmployeeStore()
const preferenceStore = usePreferenceStore()
const theme = computed(() => preferenceStore.theme)
const emit = defineEmits(['changeActive', 'refresh'])

const employee = reactive({
  id: '',
  documentType: '',
  document: '',
  name: '',
  surname: '',
  salary: 0,
  type: '',
  active: false,
  year: preferenceStore.selectedYear
})

const beforeOpen = () => {
  clearInputs()
  if (!employeeStore.selectedEmployee) return
  employee.id = employeeStore.selectedEmployee.getId()
  employee.documentType = employeeStore.selectedEmployee.getDocumentType()
  employee.document = employeeStore.selectedEmployee.getDocumentNumber()
  employee.name = employeeStore.selectedEmployee.getName()
  employee.surname = employeeStore.selectedEmployee.getSurname()
  employee.salary = employeeStore.selectedEmployee.getSalary()
  employee.type = employeeStore.selectedEmployee.getEmployeeType()
  employee.active = employeeStore.selectedEmployee.isActive()
  employee.year = employeeStore.selectedEmployee.getYear()
}

const updateEmployee = async () => {
  if (!validateData()) return

  preferenceStore.setLoading(true)
  try {
    const response = await employeeStore.updateEmployee(employee)
    if (response.status === 200) {
      notifications.notify('El empleado se ha actualizado correctamente', 'success')
      closeModal()
      if (employeeStore.selectedEmployee.isActive() !== employee.active) {
        emit('changeActive')
      } else {
        emit('refresh')
      }
    } else {
      notifications.notify('No se pudo actualizar el empleado', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const validateData = () => {
  if (employee.documentType === 0) {
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
  employee.id = ''
  employee.name = ''
  employee.surname = ''
  employee.documentType = ''
  employee.document = ''
  employee.salary = 0
  employee.type = ''
  employee.active = false
  employee.year = preferenceStore.selectedYear
}

const closeModal = () => {
  vfm.close('editEmployeeModal')
}
</script>
