<template>
  <VueFinalModal
    modal-id="detailsEmployeeModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
  >
    <div class="student-modal">
      <div class="student-modal__close">
        <div class="close" @click="closeModal">
          <img src="@/assets/img/general/close.svg" alt="close" />
        </div>
      </div>
      <div class="student-modal__header">
        <h2>Detalles del empleado</h2>
      </div>

      <div class="student-modal__content">
        <div class="student-modal__item">
          <p class="label">Tipo de documento</p>
          <p>{{ employeeStore.selectedEmployee.getDocumentTypeStr() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Documento</p>
          <p>{{ employeeStore.selectedEmployee.getDocumentNumber() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Nombres</p>
          <p>{{ employeeStore.selectedEmployee.getName() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Apellidos</p>
          <p>{{ employeeStore.selectedEmployee.getSurname() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Salario</p>
          <p>$ {{ employeeStore.selectedEmployee.getSalaryStr() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Tipo de empleado</p>
          <p>{{ employeeStore.selectedEmployee.getEmployeeTypeStr() }}</p>
        </div>
      </div>
      <div class="student-modal__footer">
        <button class="student-modal__btn edit" @click="editEmployee">Editar</button>
        <button class="student-modal__btn promote" @click="renewEmployee">Renovar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { computed, ref } from 'vue'
import { useEmployeeStore } from '@/admin/employees/context/store/employeeStore.js'

const vfm = useVfm()
const employeeStore = useEmployeeStore()
const preferenceStore = usePreferenceStore()
const theme = computed(() => preferenceStore.theme)

const editEmployee = () => {
  vfm.close('detailsEmployeeModal')
  vfm.open('editEmployeeModal')
}

const renewEmployee = async () => {
  preferenceStore.setLoading(true)
  try {
    const response = await employeeStore.renewEmployee(employeeStore.selectedEmployee)
    if (response.status === 200) {
      closeModal()
      preferenceStore.setSelectedYear(employeeStore.selectedEmployee.getYear() + 1)
      employeeStore.setSelectedEmployee(null)
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const closeModal = () => {
  vfm.close('detailsEmployeeModal')
}
</script>


