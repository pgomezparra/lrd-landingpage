<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <div>
        <span>Listado de empleados</span><span class="container-total">{{ employeeStore.employees.length }}</span>
      </div>
      <p class="l-standard-title__text">Gestiona los empleados registrados en el sistema</p>
    </div>
    <div>
      <div class="form-group">
        <p>Buscar: </p>
        <input
          v-model="search"
          ref="searchInput"
          type="text"
          placeholder="Nombre del empleado"
        />
      </div>
    </div>
    <div class="l-standard-option">
      <p>Tipo de empleado</p>
      <select
        class="select-standard"
        v-model="employeeTypeFilter"
        @change="handleTypeChange"
      >
        <option value="">Todos</option>
        <option
          v-for="(type, index) in EMPLOYEE_TYPES"
          :key="index"
          :value="index">
          {{ type }}
        </option>
      </select>
      <select
        class="select-standard"
        v-model="statusFilter"
        @change="changeStatusFilter"
      >
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
      <button class="button-standard" @click="addEmployee">
        <img class="button-payment-img" src="../../../../assets/img/general/plus.svg" alt="payment">
        Agregar
      </button>
      <button class="button-standard" @click="openExportEmployeeModal">Exportar</button>
    </div>

    <div class="l-standard-container-card">
      <div
        class="cards"
        v-for="(employee, index) in filteredEmployees"
        :key="index"
        @click="employeeDetails(employee)"
      >
        <div class="cards__avatar">
          <img src="@/assets/img/general/person.svg" alt="person">
        </div>

        <div class="cards__content">
          <p class="cards__document">
            {{ employee.getDocumentTypeStr() }} {{ employee.getDocumentNumber() }}
          </p>
          <p class="cards__name">
            {{ employee.getName() }} {{ employee.getSurname() }}
          </p>
          <p class="cards__type">
            {{ employee.getEmployeeTypeStr() }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <edit-employee-modal @changeActive="changeActive" @refresh="refreshData" />
  <create-employee-modal @changeActive="statusFilter = 'active'" @refresh="refreshData" />
  <details-employee-modal />
  <export-employee-modal :statusFilter="statusFilter" />
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useVfm } from 'vue-final-modal'
import { useEmployeeStore } from '@/admin/employees/context/store/employeeStore.js'
import CreateEmployeeModal from '@/admin/employees/context/components/modals/CreateEmployeeModal.vue'
import DetailsEmployeeModal from '@/admin/employees/context/components/modals/DetailsEmployeeModal.vue'
import { EMPLOYEE_TYPES } from '@/admin/shared/constants.js'
import EditEmployeeModal from '@/admin/employees/context/components/modals/EditEmployeeModal.vue'
import ExportEmployeeModal from '@/admin/employees/context/components/modals/ExportEmployeeModal.vue'
import { notifications } from '@/shared/notifications.js'

const preferenceStore = usePreferenceStore()
const employeeStore = useEmployeeStore()
const vfm = useVfm()

const statusFilter = ref('active')
const employeeTypeFilter = ref('')
const search = ref('')
const searchInput = ref(null)

const filteredEmployees = computed(() => {
  if (search.value === '') {
    return employeeStore.employees
  }
  return employeeStore.employees.filter((employee) => {
    return `${employee.getName()} ${employee.getSurname()}`.toLowerCase().includes(search.value.toLowerCase())
  })
})

const changeStatusFilter = async (event) => {
  employeeStore.setEmployees([])
  search.value = ''
  await refreshData()
}

const handleTypeChange = async (event) => {
  employeeStore.setEmployees([])
  search.value = ''
  await refreshData()
}

const changeActive = async () => {
  employeeStore.setEmployees([])
  search.value = ''
  if (statusFilter.value === 'active') statusFilter.value = 'inactive'
  else statusFilter.value = 'active'
  await refreshData()
}

async function refreshData() {
  preferenceStore.setLoading(true)
  try {
    search.value = ''
    await employeeStore.searchEmployees(statusFilter.value === 'active', employeeTypeFilter.value)
    await nextTick(() => {
      searchInput.value?.focus()
    })
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

async function openExportEmployeeModal() {
  if (employeeStore.employees.length === 0) {
    notifications.notify('No hay empleados para exportar', 'error')
    return
  }

  vfm.open('exportEmployeeModal')
}

const employeeDetails = (employee) => {
  employeeStore.setSelectedEmployee(employee)
  vfm.open('detailsEmployeeModal')
}

const addEmployee = () => {
  vfm.open('createEmployeeModal')
}

watch(
  () => ({
    year: preferenceStore.selectedYear
  }),
  async (newVal) => {
    await refreshData()
  }
)

onMounted(async () => {
  employeeStore.setSelectedEmployee(null)
  employeeStore.setEmployees([])
  if (preferenceStore.selectedYear) await refreshData()
})
</script>
