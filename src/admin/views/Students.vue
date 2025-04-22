<template>
  <div class="l-standard">
    <p class="l-standard-title">Listado de Estudiantes por Grado</p>
    <div class="l-standard-option">
      <p>Selecciona el grado a consultar:</p>
      <select class="select-standard" v-model="preferenceStore.selectedGrade" @change="handleGradeChange">
        <option disabled value="">Seleccione un grado</option>
        <option
          v-for="grade in preferenceStore.grades"
          :key="grade.getId()"
          :value="grade.getId()">
          {{ grade.getGrade() }}
        </option>
      </select>
    </div>

    <div class="l-standard-container-card">
      <div class="cards" v-for="(student, index) in studentStore.students" :key="index">
        <div>
          <img src="@/assets/img/general/person.svg" alt="person">
        </div>
        <p>{{ student.getDocumentType() }} {{ student.getDocument() }}</p>
        <div class="cards__name">
          <p>{{ student.getName() }}</p>
          <p>{{ student.getSurname() }}</p>
        </div>
        <button class="button-edit" @click="editStudent(student)">Editar</button>
      </div>

    </div>
  </div>
  <edit-student-modal />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { useVfm } from 'vue-final-modal'
import EditStudentModal from '@/admin/students/context/components/modals/EditStudentModal.vue'

const preferenceStore = usePreferenceStore()
const studentStore = useStudentStore()
const vfm = useVfm()

const handleGradeChange = async (event) => {
  preferenceStore.setSelectedGrade(parseInt(event.target.value))
}

async function refreshData() {
  await studentStore.searchStudents(true)
}

const editStudent = (student) => {
  studentStore.setSelectedStudent(student)
  vfm.open('editStudentModal')
}

watch(
  () => ({
    grade: preferenceStore.selectedGrade,
    year: preferenceStore.selectedYear
  }),
  async (newVal) => {
    if (newVal.grade || newVal.year) {
      await refreshData()
    }
  }
)

onMounted(async () => {
  if (preferenceStore.selectedGrade) {
    await refreshData()
  }
})
</script>