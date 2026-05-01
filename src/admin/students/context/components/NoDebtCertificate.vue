<template>
  <div class="m-no-debt-certificate">
    <div class="m-no-debt-certificate__print-area">
      <div class="m-no-debt-certificate__certificate">

        <div class="m-no-debt-certificate__header">
          <img src="@/assets/img/logo.png" alt="Logo" class="m-no-debt-certificate__logo" />
          <div class="m-no-debt-certificate__institution-info">
            <h1>LICEO REY DAVID</h1>
            <p>PRESCOLAR - PRIMARIA - BACHILLERATO</p>
          </div>
        </div>


        <div class="m-no-debt-certificate__body">
          <h2 class="m-no-debt-certificate__title">Paz y Salvo</h2>
          <p class="m-no-debt-certificate__text">
            El Liceo Rey David hace constar que
            <strong>{{ student.getName().toUpperCase() }} {{ student.getSurname().toUpperCase() }}</strong>,
            matriculado en el grado <strong>{{ student.getGrade().toUpperCase() }}</strong> en el año
            <strong>{{ student.getYear() }}</strong>, se encuentra a
            <strong>Paz y Salvo</strong> con todas sus obligaciones.
          </p>
        </div>

        <div class="m-no-debt-certificate__signature">
          <div class="line"></div>
          <p>SECRETARIA</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'

const emit = defineEmits(['closeCertificate'])
const studentsStore = useStudentStore()
const student = studentsStore.selectedStudent

onMounted(() => {
  setTimeout(() => {
    window.print()
    emit('closeCertificate')
  }, 500)
})
</script>