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
        ref="studentNameInput"
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
      <div v-if="consolidatedPayments.length > 0">
        <div>Resumen de pagos</div>
        <div>
          <span>Matrícula: $ {{ consolidatedPayments[0].getValueFormatted() }}</span>
          <span>Saldo: $ {{ consolidatedPayments[0].getBalanceFormatted() }}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr;">
          <div>
            <div v-for="payment in consolidatedPayments.slice(1,6)" :key="payment.getMonthId()"
                 style="display: flex; flex-direction: column; align-items: center;">
              <span>{{ payment.getMonth() }}</span>
              <span>Pagado: $ {{ payment.getValueFormatted() }}</span>
              <span>Saldo: $ {{ payment.getBalanceFormatted() }}</span>
            </div>
          </div>
          <div>
            <div v-for="payment in consolidatedPayments.slice(6)" :key="payment.getMonthId()"
                 style="display: flex; flex-direction: column; align-items: center;">
              <span>{{ payment.getMonth() }}</span>
              <span>Pagado: $ {{ payment.getValueFormatted() }}</span>
              <span>Saldo: $ {{ payment.getBalanceFormatted() }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="l-standard-container-payments__title-payment">
        <p class="l-standard-container-payments__title">Historial de pagos</p>
        <button class="button-payment" @click="addPayment">
          <img class="button-payment-img" src="@/assets/img/general/payments.svg" alt="payment">
          Generar pago
        </button>
      </div>
      <div class="l-standard-container-payments__table">
        <div class="l-standard-container-payments__table-thead">
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
          <p>{{ formatDate(payment.getDate()) }}</p>
          <p>{{ payment.getDescription() }}</p>
          <p>{{ payment.isPension() ? payment.getMonth() : '' }}</p>
          <p>${{ payment.getValueFormatted() }}</p>
          <p>{{ payment.getPaymentType() }}</p>
          <p>{{ payment.getPaymentMethod() }}</p>
          <p class="l-standard-container-payments__table-tbody-icon">
            <button class="button-payment-circle" @click="editPayment(payment)">
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
  <edit-payment-modal />
  <create-payment-modal :consolidated-payments="consolidatedPayments" />
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { nextTick, ref, watch } from 'vue'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { formatDate } from '@/shared/utils.js'
import { useVfm } from 'vue-final-modal'
import EditPaymentModal from '@/admin/payments/context/components/modals/EditPaymentModal.vue'
import CreatePaymentModal from '@/admin/payments/context/components/modals/CreatePaymentModal.vue'

const grade = ref(0)
const student = ref(0)
const studentName = ref('')
const students = ref([])
const payments = ref([])
const consolidatedPayments = ref([])
const studentNameInput = ref(null)
const vfm = useVfm()

const preferenceStore = usePreferenceStore()
const studentsStore = useStudentStore()
const paymentsStore = usePaymentStore()

const changeGrade = (event) => {
  preferenceStore.setSelectedGrade(parseInt(event.target.value))
  clearData()
  nextTick(() => {
    studentNameInput.value?.focus()
  })
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

const editPayment = (payment) => {
  paymentsStore.setSelectedPayment(payment)
  vfm.open('editPaymentModal')
}

const addPayment = () => {
  vfm.open('createPaymentModal')
}

watch(grade, (newGrade) => {
  getStudents()
})

watch(() => preferenceStore.selectedYear, (newYear) => {
  if (preferenceStore.selectedGrade === 0) return
  getStudents()
  clearData()
})

watch(studentName, async (newVal) => {
  const match = students.value.find(s => `${s.getName()} ${s.getSurname()}` === newVal)
  if (match) {
    student.value = match.getId()
    studentsStore.setSelectedStudent(match)
    const response = await paymentsStore.searchPayments(match.getId())
    payments.value = response.payments
    consolidatedPayments.value = response.consolidatedPayments
  }
})

</script>