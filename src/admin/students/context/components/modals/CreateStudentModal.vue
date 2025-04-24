<template>
  <VueFinalModal
    modal-id="createStudentModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
    @opened="onOpen"
  >
    <div>
      <div>
        <p>Editar usuario</p>
      </div>
      <div>
        <div>
          <p>Tipo de documento</p>
          <select class="select-standard" v-model="student.documentType" ref="documentTypeInput">
            <option disabled value="">Seleccione un tipo de documento</option>
            <option value="1">Registro Civil</option>
            <option value="2">Tarjeta de Identidad</option>
            <option value="3">Cédula de Ciudadanía</option>
          </select>
        </div>
        <div>
          <p>Documento</p>
          <input
            v-model="student.document"
            type="text"
            placeholder="Documento"
            @blur="validateDocument"
          >
        </div>
        <div>
          <p>Nombres</p>
          <input
            :value="student.name"
            type="text"
            placeholder="Nombres"
            ref="nameInput"
          >
        </div>
        <div>
          <p>Apellidos</p>
          <input
            v-model="student.surname"
            type="text"
            placeholder="Apellidos"
          >
        </div>
        <div>
          <p>Grado</p>
          <select class="select-standard" v-model="student.grade">
            <option disabled value="">Seleccione un grado</option>
            <option
              v-for="grade in preferenceStore.grades"
              :key="grade.getId()"
              :value="grade.getId()">
              {{ grade.getGrade() }}
            </option>
          </select>
        </div>
        <div>
          <p>Valor de matrícula</p>
          <input
            type="text"
            placeholder="Matrícula"
            v-model="student.registration"
          >
        </div>
        <div>
          <p>Valor de pensión</p>
          <input
            type="text"
            placeholder="Pensión"
            v-model="student.pension"
          >
        </div>

      </div>
      <button class="button-edit" @click="closeModal">
        Confirm
      </button>

    </div>


  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { reactive, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import * as utils from '@/shared/utils.js'
import { notifications } from '@/shared/notifications.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const preferenceStore = usePreferenceStore()
const paymentStore = usePaymentStore()

const documentTypeInput = ref(null)

const student = reactive({
  name: '',
  surname: '',
  documentType: '',
  document: '',
  birthDate: '',
  grade: '',
  registration: '',
  pension: ''
})

watch(
  () => student.grade,
  async (newValue) => {
    await getPaymentValues()
  }
)

watch(
  () => student.document,
  async (newValue) => {
    if (!newValue) return
    student.document = utils.onlyNumbers(newValue)
  }
)

const beforeOpen = async () => {
  clearInputs()
  if (preferenceStore.selectedGrade) {
    student.grade = preferenceStore.selectedGrade.getId()
    const paymentValues = await preferenceStore.getPaymentValues(student.grade, preferenceStore.selectedYear)
    if (paymentValues.length > 0) {
      await getPaymentValues()
    }
  }
}

const onOpen = () => {
  documentTypeInput.value.focus()
}

const getPaymentValues = async () => {
  try {
    const paymentValues = await preferenceStore.getPaymentValues(student.grade, preferenceStore.selectedYear)
    if (paymentValues.length > 0) {
      student.registration = paymentValues[0].getRegistration()
      student.pension = paymentValues[0].getPension()
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const validateDocument = async () => {
  try {
    const response = await studentStore.searchByDocument(student.document)
    if (response.status === 200) {
      const students = response.students
      if (students.length === 0) {
        return
      }

      const year = students[0].getYear()
      if (year === preferenceStore.selectedYear) {
        notifications.notify('El estudiante ya existe en el año actual', 'error')
        closeModal()
        return
      } else if (year === preferenceStore.selectedYear - 1 && students[0].getGradeId() === 11) {
        notifications.notify('El estudiante ya se encuentra graduado', 'warning')
        closeModal()
        return
      }

      student.name = students[0].getName()
      student.surname = students[0].getSurname()

      if (students[0].isActive()) await validateDebts(students[0].getId(), year)
    } else {
      notifications.notify('No se pudo validar el estudiante', 'error')
      closeModal()
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const validateDebts = async (studentId, year) => {
  try {
    const response = await paymentStore.searchPayments(studentId, year)
    if (response.consolidatedPayments[response.consolidatedPayments.length - 1].getBalance() > 0) {
      notifications.notify(`El alumno tiene deudas pendientes en el año ${year}`, 'warning')
      closeModal()
      return
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const clearInputs = () => {
  student.name = ''
  student.surname = ''
  student.documentType = ''
  student.document = ''
  student.birthDate = ''
  student.grade = ''
  student.registration = ''
  student.pension = ''
}

const closeModal = () => {
  vfm.close('createStudentModal')
}

</script>
