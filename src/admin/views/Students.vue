<template>
  <div>
    <h1>Hola Students</h1>
    <select v-model="preferenceStore.selectedGrade" @change="handleGradeChange">
      <option
        v-for="grade in preferenceStore.grades"
        :key="grade.getId()"
        :value="grade.getId()">
        {{ grade.getGrade() }}
      </option>
    </select>
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Documento</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(student, index) in studentStore.students" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ student.getDocumentType() }} {{ student.getDocument() }}</td>
        <td>{{ student.getName() }}</td>
        <td>{{ student.getSurname() }}</td>
        <td>
          <button @click="editStudent(student)">Editar</button>
        </td>
      </tr>
      </tbody>
    </table>
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