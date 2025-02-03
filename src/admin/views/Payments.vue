<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>Pagos por Estudiante</p>
      <p class="l-standard-title__text">Selecciona el grado y digita el nombre del estudiante a revisar el pago</p>
    </div>
    <div class="l-standard-option-payment">
      <select class="select-standard" v-model="grade" @change="changeGrade">
        <option disabled value="0">Grado</option>
        <option
          v-for="grade in preferenceStore.grades"
          :key="grade.getId()"
          :value="grade.getId()">
          {{ grade.getGrade() }}
        </option>
      </select>
      <input
        class="input-standard"
        list="students"
        v-model="studentName"
        placeholder="Buscar estudiante"
      />

      <datalist id="students">
        <option
          v-for="student in students"
          :key="student.getId()"
          :value="`${student.getName()} ${student.getSurname()}`"
        />
      </datalist>
    </div>
    <div v-if="student" class="l-standard-container-payments">
      <div class="l-standard-container-payments__title-payment">
        <p class="l-standard-container-payments__title">Historial de pagos</p>
        <button class="button-payment">
          <img class="button-payment-img" src="@/assets/img/general/payments.svg" alt="payment">
          Generar pago
        </button>
      </div>
      <div class="l-standard-container-payments__table">
        <div  class="l-standard-container-payments__table-thead">
          <p>Fecha</p>
          <p>Descripción</p>
          <p> Mes</p>
          <p>Valor</p>
          <p>Tipo</p>
          <p>Método</p>
          <p>Acciones</p>
        </div>
        <div
          class="l-standard-container-payments__table-tbody"
          v-for="payment in payments" :key="payment.getId()"
        >
          <p>{{ formatDate(payment.getDate())}}</p>
          <p>{{ payment.getDescription() }}</p>
          <p>{{ payment.isPension() ? payment.getMonth() : '' }}</p>
          <p>${{ payment.getValueFormatted() }}</p>
          <p>{{ payment.getPaymentType() }}</p>
          <p>{{ payment.getPaymentMethod() }}</p>
          <p class="l-standard-container-payments__table-tbody-icon">
            <button class="button-payment-circle">
              <img src="@/assets/img/general/edit.svg" alt="edit">
            </button>
            <button class="button-payment-circle">
              <img class="button-payment-circle-img" src="@/assets/img/general/printer.svg" alt="printer">
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { ref, watch } from 'vue'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { formatDate } from '@/shared/utils.js'

const grade = ref(0)
const student = ref(0)
const studentName = ref('')
const students = ref([])
const payments = ref([])

const preferenceStore = usePreferenceStore()
const studentsStore = useStudentStore()
const paymentsStore = usePaymentStore()

const changeGrade = (event) => {
  preferenceStore.setSelectedGrade(parseInt(event.target.value))
  clearData()
}

const clearData = () => {
  studentName.value = ''
  student.value = 0
  students.value = []
  payments.value = []
}

async function getStudents() {
  try {
    const response = await studentsStore.searchStudents(true)
    students.value = response.students
  } catch (error) {
    console.error(error)
  }
}

watch(grade, (newGrade) => {
  getStudents()
})

watch(() => preferenceStore.selectedYear, (newYear) => {
  getStudents()
  clearData()
})

watch(studentName, async (newVal) => {
  const match = students.value.find(s => `${s.getName()} ${s.getSurname()}` === newVal)
  if (match) {
    student.value = match.getId()
    payments.value = await paymentsStore.searchPayments(match.getId())
  }
})

</script>