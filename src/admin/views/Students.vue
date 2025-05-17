<template>
  <loading-overlay />
  <div class="l-standard">
    <div class="l-standard-title">
      <div>
        <span>Listado de estudiantes</span><span class="container-total">{{ studentStore.students.length }}</span>
      </div>
      <p class="l-standard-title__text">Gestiona los estudiantes registrados en el sistema</p>
    </div>
    <div class="l-standard-option">
      <p class="text-desktop">Selecciona el grado a consultar:</p>
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
      <button class="button-standard" @click="addStudent">Agregar estudiante</button>
    </div>

    <div class="l-standard-container-card">
      <div class="cards" v-for="(student, index) in studentStore.students" :key="index"
           @click="studentDetails(student)">
        <div>
          <img src="@/assets/img/general/person.svg" alt="person">
        </div>
        <p>{{ student.getDocumentType() }} {{ student.getDocument() }}</p>
        <div class="cards__name">
          <p>{{ student.getName() }}</p>
          <p>{{ student.getSurname() }}</p>
          <p v-if="statusFilter === 'inactive'">{{ student.getGrade() }}</p>
        </div>
      </div>

    </div>
  </div>
  <edit-student-modal @changeActive="statusFilter = 'active'" @refresh="refreshData" />
  <create-student-modal @refresh="refreshData" />
  <details-student-modal />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { useVfm } from 'vue-final-modal'
import EditStudentModal from '@/admin/students/context/components/modals/EditStudentModal.vue'
import CreateStudentModal from '@/admin/students/context/components/modals/CreateStudentModal.vue'
import DetailsStudentModal from '@/admin/students/context/components/modals/DetailsStudentModal.vue'
import LoadingOverlay from '@/admin/views/LoadingOverlay.vue'

const preferenceStore = usePreferenceStore()
const studentStore = useStudentStore()
const vfm = useVfm()

const statusFilter = ref('active')

const handleGradeChange = async (event) => {
  preferenceStore.setSelectedGrade(parseInt(event.target.value))
}

const changeStatusFilter = async (event) => {
  studentStore.setStudents([])
  if (event.target.value === 'inactive') {
    preferenceStore.setSelectedGrade(0)
    await refreshData()
  }
}

async function refreshData() {
  preferenceStore.setLoading(true)
  try {
    await studentStore.searchStudents(statusFilter.value === 'active')
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
  }
)

onMounted(async () => {
  preferenceStore.setSelectedGrade(0)
  studentStore.setSelectedStudent(null)
  studentStore.setStudents([])
})
</script>
