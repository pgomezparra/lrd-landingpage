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
      <CustomSelect
        v-model="employeeTypeFilter"
        :options="employeeTypeFilterOptions"
        label-key="label"
        value-key="value"
        placeholder="Todos"
        @change="handleTypeChange"
      />
      <CustomSelect
        v-model="statusFilter"
        :options="statusFilterOptions"
        label-key="label"
        value-key="value"
        @change="changeStatusFilter"
      />
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

        <div class="cards__menu">
          <button class="cards__menu-trigger" @click.stop="toggleMenu(index)">&#8942;</button>
          <div v-if="openMenuIndex === index" class="cards__menu-dropdown">
            <button @click.stop="editEmployee(employee)">Editar</button>
            <button @click.stop="renewEmployee(employee)">Renovar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <edit-employee-modal @changeActive="changeActive" @refresh="refreshData" />
  <create-employee-modal @changeActive="statusFilter = 'active'" @refresh="refreshData" />
  <export-employee-modal :statusFilter="statusFilter" />
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useVfm } from 'vue-final-modal'
import { useEmployeeStore } from '@/admin/employees/context/store/employeeStore.js'
import CreateEmployeeModal from '@/admin/employees/context/components/modals/CreateEmployeeModal.vue'
import { EMPLOYEE_TYPES } from '@/admin/shared/constants.js'
import EditEmployeeModal from '@/admin/employees/context/components/modals/EditEmployeeModal.vue'
import ExportEmployeeModal from '@/admin/employees/context/components/modals/ExportEmployeeModal.vue'
import CustomSelect from '@/admin/shared/components/CustomSelect.vue'
import { notifications } from '@/shared/notifications.js'

const preferenceStore = usePreferenceStore()
const employeeStore = useEmployeeStore()
const vfm = useVfm()

const statusFilter = ref('active')
const employeeTypeFilter = ref('')
const search = ref('')
const searchInput = ref(null)
const openMenuIndex = ref(null)

const employeeTypeFilterOptions = computed(() => [
  { label: 'Todos', value: '' },
  ...Object.entries(EMPLOYEE_TYPES).map(([value, label]) => ({ label, value }))
])

const statusFilterOptions = [
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' }
]

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

const toggleMenu = (index) => {
  openMenuIndex.value = openMenuIndex.value === index ? null : index
}

const editEmployee = (employee) => {
  openMenuIndex.value = null
  employeeStore.setSelectedEmployee(employee)
  vfm.open('editEmployeeModal')
}

const renewEmployee = async (employee) => {
  openMenuIndex.value = null
  preferenceStore.setLoading(true)
  try {
    const response = await employeeStore.renewEmployee(employee)
    if (response.status === 200) {
      preferenceStore.setSelectedYear(employee.getYear() + 1)
      employeeStore.setSelectedEmployee(null)
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const closeMenu = () => {
  openMenuIndex.value = null
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
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>
