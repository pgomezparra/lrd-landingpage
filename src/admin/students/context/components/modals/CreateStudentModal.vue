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
      <p class="modal-title">Registrar usuario</p>
      <div class="modal-body">
        <div class="container-form-edit">
          <div class="form-group">
            <p>Tipo de documento</p>
            <select class="select-methods" v-model="student.documentType" ref="documentTypeInput">
              <option disabled value="">Seleccione un tipo de documento</option>
              <option value="1">Registro Civil</option>
              <option value="2">Tarjeta de Identidad</option>
              <option value="3">Cédula de Ciudadanía</option>
            </select>
          </div>
          <div class="form-group">
            <p>Documento</p>
            <input
              v-model="student.document"
              type="text"
              placeholder="Documento"
              @blur="validateDocument"
            >
          </div>
        </div>
        <div class="form-group">
            <p>Nombres</p>
            <input
              v-model="student.name"
              type="text"
              placeholder="Nombres"
              maxlength="25"
            />
          </div>
          <div class="form-group">
            <p>Apellidos</p>
            <input
              v-model="student.surname"
              type="text"
              placeholder="Apellidos"
              maxlength="25"
            />
          </div>
        <div class="container-form-edit">
          <div class="form-group">
            <p>Edad</p>
            <input
              v-model="student.age"
              type="text"
              placeholder="Edad"
              maxlength="2"
            />
          </div>
          <div class="form-group">
            <p>Grado</p>
            <select class="select-methods" v-model="student.grade">
              <option disabled value="0">Seleccione un grado</option>
              <option
                v-for="grade in preferenceStore.grades"
                :key="grade.getId()"
                :value="grade.getId()"
              >
                {{ grade.getGrade() }}
              </option>
            </select>
          </div>
        </div>
          <div class="form-group">
            <p>Valor de matrícula</p>
            <input
              type="text"
              placeholder="Matrícula"
              v-model="student.registration"
              maxlength="10"
            />
          </div>

          <div class="form-group">
            <p>Valor de pensión</p>
            <input
              type="text"
              placeholder="Pensión"
              v-model="student.pension"
              maxlength="10"
            />
          </div>
        <div>
          <div class="form-group">
            <p>Correo</p>
            <input
              type="text"
              placeholder="Correo"
              v-model="student.email"
              maxlength="40"
            />
          </div>
        </div>
        <div class="container-form-edit">
          <div class="form-group">
            <p>Tipo de documento</p>
            <select
              v-model="student.parentDocumentTypeId"
              class="select-document"
            >
              <option disabled value="">Seleccione un tipo de documento</option>
              <option value="1">Registro Civil</option>
              <option value="2">Tarjeta de Identidad</option>
              <option value="3">Cédula de Ciudadanía</option>
            </select>
          </div>
          <div class="form-group">
            <p>Documento acudiente</p>
            <input
              v-model="student.parentDocument"
              type="text"
              placeholder="Documento acudiente"
            />
          </div>
        </div>
        <div class="form-group">
          <p>Nombre acudiente</p>
          <input
            v-model="student.parentName"
            type="text"
            placeholder="Nombre acudiente"
          />
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="registerStudent">Guardar</button>
      </div>
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
  documentType: 0,
  document: '',
  age: '',
  grade: 0,
  registration: 0,
  pension: 0,
  email: '',
  active: true,
  year: preferenceStore.selectedYear,
  parentDocumentTypeId: 0,
  parentDocument: '',
  parentName: ''
})

watch(
  () => student.grade,
  async (newValue) => {
    if (!newValue) return
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
  if (preferenceStore.selectedGrade !== 0) {
    student.grade = preferenceStore.selectedGrade
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
    if (!student.document) return

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
      if (students[0].getEmail()) student.email = students[0].getEmail()
      if (students[0].getParentDocumentTypeId()) student.parentDocumentTypeId = students[0].getParentDocumentTypeId()
      if (students[0].getParentDocument()) student.parentDocument = students[0].getParentDocument()
      if (students[0].getParentName()) student.parentName = students[0].getParentName()

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
      notifications.notify(`El estudiante tiene deudas pendientes en el año ${year}`, 'warning')
      closeModal()
      return
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const registerStudent = async () => {
  if (!validateData()) return

  try {
    const response = await studentStore.registerStudent(student)
    if (response.status === 201) {
      notifications.notify('El estudiante se ha registrado correctamente', 'success')
      closeModal()
      preferenceStore.setSelectedGrade(parseInt(student.grade))
    } else {
      notifications.notify('No se pudo registrar el estudiante', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const validateData = () => {
  if (student.documentType === 0) {
    notifications.notify('Debe seleccionar el tipo de documento del estudiante', 'error')
    return false
  }

  if (student.document === '') {
    notifications.notify('El documento del estudiante no puede estar vacío', 'error')
    return false
  }

  if (student.name === '') {
    notifications.notify('El nombre del estudiante no puede estar vacío', 'error')
    return false
  }

  if (student.surname === '') {
    notifications.notify('El apellido del estudiante no puede estar vacío', 'error')
    return false
  }

  if (student.age === '') {
    notifications.notify('La edad del estudiante no puede estar vacía', 'error')
    return false
  }

  if (student.grade === 0) {
    notifications.notify('Debe seleccionar el grado del estudiante', 'error')
    return false
  }

  if (student.registration === '0' || student.registration === '') {
    notifications.notify('Debe ingresar el valor de matrícula del estudiante', 'error')
    return false
  }

  if (student.pension === '0' || student.pension === '') {
    notifications.notify('Debe ingresar el valor de pensión del estudiante', 'error')
    return false
  }

  if (student.parentDocumentTypeId === 0) {
    notifications.notify('Debe seleccionar el tipo de documento del acudiente del estudiante', 'error')
    return false
  }

  if (student.parentDocument === '') {
    notifications.notify('El documento del acudiente del estudiante no puede estar vacío', 'error')
    return false
  }

  if (student.parentName === '') {
    notifications.notify('El nombre del acudiente del estudiante no puede estar vacío', 'error')
    return false
  }

  return true
}

const clearInputs = () => {
  student.name = ''
  student.surname = ''
  student.documentType = 0
  student.document = ''
  student.age = ''
  student.grade = 0
  student.registration = 0
  student.pension = 0
  student.email = ''
  student.year = preferenceStore.selectedYear
  student.active = true
  student.parentDocumentTypeId = 0
  student.parentDocument = ''
  student.parentName = ''
}

const closeModal = () => {
  vfm.close('createStudentModal')
}
</script>

