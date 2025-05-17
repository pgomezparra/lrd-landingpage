<template>
  <loading-overlay />
  <div class="l-standard">
    <div class="l-standard-title">
      <p>Pagos por Estudiante</p>
      <p class="l-standard-title__text">
        Selecciona el grado y digita el nombre del estudiante a revisar el pago
      </p>
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
      <div class="l-standard-option-payment__input-student">
        <input
          class="input-standard"
          style="width: 90%; height: 2.5rem;"
          v-model="studentName"
          placeholder="Buscar estudiante"
          ref="studentNameInput"
          @focus="showDropdown = true"
          @blur="hideDropdown"
        />
        <ul
          v-if="showDropdown && filteredStudents.length"
          class="autocomplete-dropdown"
        >
          <li
            v-for="student in filteredStudents"
            :key="student.getId()"
            @click="selectStudent(student)"
          >
            {{ student.getName() }} {{ student.getSurname() }}
          </li>
        </ul>
      </div>
      <button class="button-standard" @click="clearPayments">Limpiar</button>
    </div>
    <div v-if="student" class="l-standard-container-payments">
      <div v-if="consolidatedPayments.length > 0" class="payments-summary">
        <h2>Resumen de pagos</h2>

        <div class="payment-card main-payment">
          <h3>Matrícula</h3>
          <p>Pagado: $ {{ consolidatedPayments[0].getValueFormatted() }}</p>
          <p>Saldo: $ {{ consolidatedPayments[0].getBalanceFormatted() }}</p>
        </div>

        <div class="payments-grid compact">
          <div
            class="payment-card"
            v-for="payment in consolidatedPayments.slice(1)"
            :key="payment.getMonthId()"
          >
            <strong>{{ payment.getMonth() }}</strong>
            <span>$ {{ payment.getValueFormatted() }}</span>
            <span>Saldo: $ {{ payment.getBalanceFormatted() }}</span>
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
          <p>{{ payment.getDateStr() }}</p>
          <p>{{ payment.getDescription() }}</p>
          <p>{{ payment.isPension() ? payment.getMonth() : '' }}</p>
          <p>${{ payment.getValueFormatted() }}</p>
          <p>{{ payment.getPaymentType() }}</p>
          <p>{{ payment.getPaymentMethod() }}<span
            v-if="payment.isTransfer() && payment.getTransferCode()"> ({{ payment.getTransferCode() }})</span>
          </p>
          <p class="l-standard-container-payments__table-tbody-icon">
            <button class="button-payment-circle" @click="editPayment(payment)">
              <img src="@/assets/img/general/edit.svg" alt="edit">
            </button>
            <button class="button-payment-circle" @click="printPayment(payment)">
              <img class="button-payment-circle-img" src="@/assets/img/general/printer.svg" alt="printer">
            </button>
            <button class="button-payment-circle"
                    @click="sendSupportPayment(payment)">
              <img class="button-payment-circle-img" src="@/assets/img/general/send-mail.svg" alt="mail">
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
  <edit-payment-modal @refresh="refreshData" />
  <create-payment-modal :consolidated-payments="consolidatedPayments" @refresh="refreshData" />
  <payment-support
    v-if="showSupport"
    :consolidated-payments="consolidatedPayments"
    @closePaymentSupport="closeSupport"
  />
  <add-email-modal @sendEmail="sendSupportPayment" />
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { computed, nextTick, ref, watch } from 'vue'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { useVfm } from 'vue-final-modal'
import EditPaymentModal from '@/admin/payments/context/components/modals/EditPaymentModal.vue'
import CreatePaymentModal from '@/admin/payments/context/components/modals/CreatePaymentModal.vue'
import PaymentSupport from '@/admin/payments/context/components/PaymentSupport.vue'
import AddEmailModal from '@/admin/payments/context/components/modals/AddEmailModal.vue'
import LoadingOverlay from '@/admin/views/LoadingOverlay.vue'

const grade = ref(0)
const student = ref(0)
const studentName = ref('')
const students = ref([])
const payments = ref([])
const consolidatedPayments = ref([])
const studentNameInput = ref(null)
const showSupport = ref(false)
const showDropdown = ref(false)


const vfm = useVfm()

const preferenceStore = usePreferenceStore()
const studentsStore = useStudentStore()
const paymentsStore = usePaymentStore()


watch(grade, (newGrade) => {
  getStudents()
})

watch(() => preferenceStore.selectedYear, (newYear) => {
  if (preferenceStore.selectedGrade === 0) return
  getStudents()
  clearData()
})

const selectStudent = async (selectedStudent) => {
  studentName.value = `${selectedStudent.getName()} ${selectedStudent.getSurname()}`
  student.value = selectedStudent.getId()
  studentsStore.setSelectedStudent(selectedStudent)

  preferenceStore.setLoading(true)
  try {
    const response = await paymentsStore.searchPayments(selectedStudent.getId())
    payments.value = response.payments
    consolidatedPayments.value = response.consolidatedPayments
  } catch (error) {
    console.error(error)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const filteredStudents = computed(() =>
  studentName.value
    ? students.value.filter(s =>
      `${s.getName()} ${s.getSurname()}`.toLowerCase().includes(studentName.value.toLowerCase())
    )
    : []
)

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

const clearPayments = () => {
  payments.value = []
  studentName.value = ''
  student.value = 0
  nextTick(() => {
    studentNameInput.value?.focus()
  })
}

const printPayment = async (payment) => {
  paymentsStore.setSelectedPayment(payment)
  showSupport.value = true
}

const closeSupport = () => {
  showSupport.value = false
  paymentsStore.setSelectedPayment(null)
}

async function getStudents() {
  preferenceStore.setLoading(true)
  try {
    const response = await studentsStore.searchStudents(true)
    students.value = response.students
  } catch (error) {
    console.error(error)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const editPayment = (payment) => {
  paymentsStore.setSelectedPayment(payment)
  vfm.open('editPaymentModal')
}

const addPayment = () => {
  vfm.open('createPaymentModal')
}

const refreshData = async () => {
  preferenceStore.setLoading(true)
  try {
    const response = await paymentsStore.searchPayments(studentsStore.selectedStudent.getId())
    payments.value = response.payments
    consolidatedPayments.value = response.consolidatedPayments
  } catch (error) {
    console.error(error)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const sendSupportPayment = async (payment) => {
  if (payment) paymentsStore.setSelectedPayment(payment)
  if (!studentsStore.selectedStudent.hasEmail()) {
    await vfm.open('addEmailModal')
    return
  }

  preferenceStore.setLoading(true)
  try {
    await paymentsStore.sendSupportPayment(studentsStore.selectedStudent, consolidatedPayments.value)
  } catch (error) {
    console.error(error)
  } finally {
    paymentsStore.setSelectedPayment(null)
    preferenceStore.setLoading(false)
  }
}
</script>

<style scoped>
.autocomplete-dropdown {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  top: 3rem;
}

.autocomplete-dropdown li {
  padding: 8px;
  cursor: pointer;
}

.autocomplete-dropdown li:hover {
  background-color: #f0f0f0;
}
</style>