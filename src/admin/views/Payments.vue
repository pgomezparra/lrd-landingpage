<template>
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
      <select
        class="select-standard"
        v-model="active"
        @change="changeState"
      >
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
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
    <div class="l-standard-option-payment-mobil">
      <div class="l-standard-option-payment-mobil__container">
        <select class="select-standard" v-model="grade" @change="changeGrade">
          <option disabled value="0">Grado</option>
          <option
            v-for="grade in preferenceStore.grades"
            :key="grade.getId()"
            :value="grade.getId()">
            {{ grade.getGrade() }}
          </option>
        </select>
        <button class="button-standard" @click="clearPayments">Limpiar</button>
      </div>
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
        <template v-for="payment in paymentsReversed" :key="payment.getId()">
          <div
            class="l-standard-container-payments__table-tbody"
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
                <img class="button-payment-circle-img" src="@/assets/img/general/edit.svg" alt="edit">
              </button>
              <button class="button-payment-circle" @click="printPayment(payment)">
                <img class="button-payment-circle-img" src="@/assets/img/general/printer.svg" alt="printer">
              </button>
              <button class="button-payment-circle"
                      @click="sendSupportPayment(payment)">
                <img class="button-payment-circle-img" src="@/assets/img/general/send-mail.svg" alt="mail">
              </button>
              <button v-if="!payment.getElectronicInvoice()" class="button-payment-circle"
                      @click="createElectronicInvoice(payment)">
                <img class="button-payment-circle-img" src="@/assets/img/general/invoice.svg" alt="invoice">
              </button>
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
  <edit-payment-modal @refresh="refreshData" />
  <create-payment-modal :consolidated-payments="consolidatedPayments" @refresh="refreshData" />
  <payment-support
    v-if="showSupport"
    :consolidated-payments="filteredConsolidatedPayments"
    @closePaymentSupport="closeSupport"
  />
  <add-email-modal @sendEmail="sendSupportPayment" />
  <create-electronic-invoice-modal :data="invoiceData" @refresh="refreshData" @clear="clearInvoice" />
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { useVfm } from 'vue-final-modal'
import EditPaymentModal from '@/admin/payments/context/components/modals/EditPaymentModal.vue'
import CreatePaymentModal from '@/admin/payments/context/components/modals/CreatePaymentModal.vue'
import PaymentSupport from '@/admin/payments/context/components/PaymentSupport.vue'
import AddEmailModal from '@/admin/payments/context/components/modals/AddEmailModal.vue'
import { getFilteredConsolidated } from '@/admin/shared/utils.js'
import { notifications } from '@/shared/notifications.js'
import CreateElectronicInvoiceModal from '@/admin/payments/context/components/modals/CreateElectronicInvoiceModal.vue'

const grade = ref(0)
const active = ref('active')
const student = ref(0)
const studentName = ref('')
const students = ref([])
const payments = ref([])
const consolidatedPayments = ref([])
const filteredConsolidatedPayments = ref([])
const studentNameInput = ref(null)
const showSupport = ref(false)
const showDropdown = ref(false)
const invoiceData = reactive({
  identification: '',
  id: 0,
  price: 0,
  observations: ''
})

const paymentsReversed = computed(() => [...payments.value].reverse())


const vfm = useVfm()

const preferenceStore = usePreferenceStore()
const studentsStore = useStudentStore()
const paymentsStore = usePaymentStore()

watch(() => preferenceStore.selectedYear, async (newYear) => {
  if (paymentsStore.externalProducts.length === 0) await paymentsStore.getExternalProducts()
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
  getStudents()
}

const changeState = (event) => {
  if (preferenceStore.selectedGrade === 0) return

  clearData()
  getStudents()
}

const clearData = () => {
  studentName.value = ''
  student.value = 0
  students.value = []
  payments.value = []
  consolidatedPayments.value = []
  filteredConsolidatedPayments.value = []
}

const clearPayments = () => {
  payments.value = []
  consolidatedPayments.value = []
  filteredConsolidatedPayments.value = []
  studentName.value = ''
  student.value = 0
  nextTick(() => {
    studentNameInput.value?.focus()
  })
}

const printPayment = async (payment) => {
  filteredConsolidatedPayments.value = getFilteredConsolidated(studentsStore.selectedStudent, payment, payments.value)
  paymentsStore.setSelectedPayment(payment)
  showSupport.value = true
}

const closeSupport = () => {
  filteredConsolidatedPayments.value = []
  showSupport.value = false
  paymentsStore.setSelectedPayment(null)
}

async function getStudents() {
  preferenceStore.setLoading(true)
  try {
    const response = await studentsStore.searchStudents(active.value === 'active')
    students.value = response.students

    await nextTick(() => {
      studentNameInput.value?.focus()
    })
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

const createElectronicInvoice = (payment) => {
  if (!studentsStore.selectedStudent.getCloudId()) {
    notifications.notify('Debe actualizar la información del estudiante para poder generar una factura electrónica', 'error')
    return
  }

  if (payment.getElectronicInvoice()) {
    notifications.notify('Este pago ya tiene factura electrónica', 'error')
    return
  }

  invoiceData.identification = studentsStore.selectedStudent.getParentDocument()
  invoiceData.id = payment.getId()
  invoiceData.price = payment.getValue()
  invoiceData.observations = payment.getDescription()
  vfm.open('createElectronicInvoiceModal')
}

const clearInvoice = () => {
  invoiceData.identification = ''
  invoiceData.id = 0
  invoiceData.price = 0
  invoiceData.observations = ''
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
    filteredConsolidatedPayments.value = getFilteredConsolidated(studentsStore.selectedStudent, payment, payments.value)
    await paymentsStore.sendSupportPayment(studentsStore.selectedStudent, filteredConsolidatedPayments.value)
  } catch (error) {
    console.error(error)
  } finally {
    filteredConsolidatedPayments.value = []
    paymentsStore.setSelectedPayment(null)
    preferenceStore.setLoading(false)
  }
}

onMounted(async () => {
  if (!preferenceStore.selectedYear) return
  if (paymentsStore.externalProducts.length === 0) await paymentsStore.getExternalProducts()
})
</script>

<style scoped>

</style>
