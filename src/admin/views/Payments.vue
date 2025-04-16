<template>
  <div>
    <h1>Hola Payments</h1>
  </div>
  <div>
    <select v-model="grade" @change="changeGrade">
      <option
        v-for="grade in preferenceStore.grades"
        :key="grade.getId()"
        :value="grade.getId()">
        {{ grade.getGrade() }}
      </option>
    </select>
    <input
      list="students"
      v-model="studentName"
    />

    <datalist id="students">
      <option
        v-for="student in students"
        :key="student.getId()"
        :value="`${student.getName()} ${student.getSurname()}`"
      />
    </datalist>
  </div>
  <div v-if="student">
    <span>Pagos Realizados</span>
    <table>
      <thead>
      <tr>
        <th>Fecha</th>
        <th>Descripción</th>
        <th>Mes</th>
        <th>Monto</th>
        <th>Tipo</th>
        <th>Método</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="payment in payments"
        :key="payment.getId()">
        <td>{{ payment.getDate() }}</td>
        <td>{{ payment.getDescription() }}</td>
        <td>{{ payment.isPension() ? payment.getMonth() : '' }}</td>
        <td>$ {{ payment.getValueFormatted() }}</td>
        <td>{{ payment.getPaymentType() }}</td>
        <td>{{ payment.getPaymentMethod() }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { ref, watch } from 'vue'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'

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