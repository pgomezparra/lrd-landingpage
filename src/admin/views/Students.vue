<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <div>
        <span>Listado de estudiantes</span><span class="container-total">{{ studentStore.students.length }}</span>
      </div>
      <p class="l-standard-title__text">Gestiona los estudiantes registrados en el sistema</p>
    </div>
    <div>
      <div class="form-group">
        <p>Buscar: </p>
        <input
          v-model="search"
          ref="searchInput"
          type="text"
          placeholder="Nombre estudiante"
        />
      </div>
    </div>
    <div class="l-standard-option">
      <p class="text-desktop">Grado a consultar:</p>
      <p class="text-mobil">Grado a consultar:</p>
      <select
        class="select-standard"
        v-model="preferenceStore.selectedGrade"
        @change="handleGradeChange"
        :disabled="statusFilter === 'inactive'"
      >
        <option disabled :value="0">Grado</option>
        <option
          v-for="grade in preferenceStore.grades"
          :key="grade.getId()"
          :value="grade.getId()">
          {{ grade.getGrade() }}
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
      <button class="button-standard" @click="addStudent">
        <img class="button-payment-img" src="../../assets/img/general/plus.svg" alt="payment">
        Agregar
      </button>
      <div class="export-container" ref="exportRef">
        <button class="button-standard" @click="toggleExportMenu">
          Exportar ⌄
        </button>

        <div v-if="showExportMenu" class="export-menu">
          <div class="export-item" @click="handleExport('pdf_students_list')">
            Lista de estudiantes
          </div>
          <div class="export-item" @click="handleExport('pdf_parents_school')">
            Planilla escuela de padres
          </div>
        </div>
      </div>
    </div>

    <div class="l-standard-container-card">
      <div
        class="cards"
        v-for="(student, index) in filteredStudents"
        :key="index"
        @click="studentDetails(student)"
      >
        <div class="cards__avatar">
          <img src="@/assets/img/general/person.svg" alt="person">
        </div>

        <div class="cards__content">
          <p class="cards__document">
            {{ student.getDocumentType() }} {{ student.getDocument() }}
          </p>

          <p class="cards__name">
            {{ student.getName() }} {{ student.getSurname() }}
          </p>

          <p v-if="statusFilter === 'inactive'" class="cards__grade">
            {{ student.getGrade() }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <edit-student-modal @changeActive="statusFilter = 'active'" @refresh="refreshData" />
  <create-student-modal @refresh="refreshData" />
  <details-student-modal />
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { useVfm } from 'vue-final-modal'
import EditStudentModal from '@/admin/students/context/components/modals/EditStudentModal.vue'
import CreateStudentModal from '@/admin/students/context/components/modals/CreateStudentModal.vue'
import DetailsStudentModal from '@/admin/students/context/components/modals/DetailsStudentModal.vue'
import { notifications } from '@/shared/notifications.js'

const preferenceStore = usePreferenceStore()
const studentStore = useStudentStore()
const vfm = useVfm()

const statusFilter = ref('active')
const search = ref('')
const searchInput = ref(null)
const showExportMenu = ref(false)
const exportRef = ref(null)

const filteredStudents = computed(() => {
  if (search.value === '') {
    return studentStore.students
  }
  return studentStore.students.filter((student) => {
    return `${student.getName()} ${student.getSurname()}`.toLowerCase().includes(search.value.toLowerCase())
  })
})

const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value
}

const handleGradeChange = async (event) => {
  preferenceStore.setSelectedGrade(parseInt(event.target.value))
}

const changeStatusFilter = async (event) => {
  studentStore.setStudents([])
  if (event.target.value === 'inactive') {
    preferenceStore.setSelectedGrade(0)
    await refreshData()
  } else {
    search.value = ''
  }
}

async function refreshData() {
  preferenceStore.setLoading(true)
  try {
    search.value = ''
    await studentStore.searchStudents(statusFilter.value === 'active')
    await nextTick(() => {
      searchInput.value?.focus()
    })
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

async function handleExport(type) {
  showExportMenu.value = false

  if (preferenceStore.selectedGrade === 0) {
    notifications.notify('Debe seleccionar un grado', 'error')
    return
  }
  if (studentStore.students.length === 0) {
    notifications.notify('No hay estudiantes para exportar', 'error')
    return
  }

  preferenceStore.setLoading(true)
  try {
    await studentStore.exportStudents(statusFilter.value === 'active', type)
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const studentDetails = (student) => {
  studentStore.setSelectedStudent(student)
  vfm.open('detailsStudentModal')
}

const addStudent = () => {
  vfm.open('createStudentModal')
}

watch(
  () => ({
    grade: preferenceStore.selectedGrade,
    year: preferenceStore.selectedYear
  }),
  async (newVal) => {
    if (newVal.grade === 0) {
      studentStore.setSelectedStudent(null)
      studentStore.setStudents([])
    }
    if (newVal.grade && newVal.year && newVal.grade !== 0) {
      await refreshData()
    }

    if (newVal.year && newVal.grade === 0 && statusFilter.value !== 'active') {
      await refreshData()
    }
  }
)

onMounted(async () => {
  preferenceStore.setSelectedGrade(0)
  studentStore.setSelectedStudent(null)
  studentStore.setStudents([])
  document.addEventListener('click', (e) => {
    if (exportRef.value && !exportRef.value.contains(e.target)) {
      showExportMenu.value = false
    }
  })
})
</script>
