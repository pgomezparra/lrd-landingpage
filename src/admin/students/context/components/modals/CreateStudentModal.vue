<template>
  <VueFinalModal
    modal-id="createStudentModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
  >
    <div>
      <p class="modal-title">Registrar estudiante</p>
      <div class="modal-body">
        <div class="container-form-edit">
          <div class="form-group">
            <p>Tipo de documento</p>
            <CustomSelect
              v-model="student.documentType"
              :options="documentTypeOptions"
              label-key="label"
              value-key="value"
              placeholder="Seleccione un tipo de documento"
            />
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
              inputmode="numeric"
              placeholder="Edad"
              maxlength="2"
            />
          </div>
          <div class="form-group">
            <p>Grado</p>
            <CustomSelect
              v-model="student.grade"
              :options="gradeOptions"
              label-key="label"
              value-key="value"
              placeholder="Seleccione un grado"
            />
          </div>
        </div>
        <div class="form-group">
          <p>Valor de matrícula</p>
          <CurrencyInput v-model="student.registration" placeholder="Matrícula" />
        </div>

        <div class="form-group">
          <p>Valor de pensión</p>
          <CurrencyInput v-model="student.pension" placeholder="Pensión" />
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
            <CustomSelect
              v-model="student.parentDocumentTypeId"
              :options="documentTypeOptions"
              label-key="label"
              value-key="value"
              placeholder="Seleccione un tipo de documento"
            />
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
        <div class="form-group">
          <p>Apellido acudiente</p>
          <input
            v-model="student.parentSurname"
            type="text"
            placeholder="Apellido acudiente"
          />
        </div>
        <div class="form-group">
          <p>Dirección</p>
          <input
            v-model="student.address"
            type="text"
            placeholder="Dirección"
          />
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-standard button-edit" @click="closeModal">Cancelar</button>
        <button class="button-standard button-edit" @click="registerStudent">Guardar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { computed, reactive, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import * as utils from '@/shared/utils.js'
import { notifications } from '@/shared/notifications.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import CustomSelect from '@/admin/shared/components/CustomSelect.vue'
import CurrencyInput from '@/admin/shared/components/CurrencyInput.vue'

const vfm = useVfm()
const studentStore = useStudentStore()
const preferenceStore = usePreferenceStore()
const paymentStore = usePaymentStore()
const theme = computed(() => preferenceStore.theme)

const emit = defineEmits(['refresh'])

const documentTypeOptions = [
  { label: 'Registro Civil', value: 1 },
  { label: 'Tarjeta de Identidad', value: 2 },
  { label: 'Cédula de Ciudadanía', value: 3 }
]

const gradeOptions = computed(() =>
  preferenceStore.grades.map((grade) => ({
    label: grade.getGrade(),
    value: grade.getId()
  }))
)

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
  parentDocumentTypeId: 3,
  parentDocument: '',
  parentName: '',
  parentSurname: '',
  address: '',
  cloudId: '',
  id: 0
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
      if (students[0].getParentSurname()) student.parentSurname = students[0].getParentSurname()
      if (students[0].getAddress()) student.address = students[0].getAddress()
      if (students[0].getCloudId()) student.cloudId = students[0].getCloudId()
      if (students[0].getId()) student.id = students[0].getId()

      if (students[0].isActive()) await validateDebts(students[0].getId(), year, students[0].getGrade())
    } else {
      notifications.notify('No se pudo validar el estudiante', 'error')
      closeModal()
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const validateDebts = async (studentId, year, grade) => {
  try {
    const response = await paymentStore.searchPayments(studentId, year)
    if (response.consolidatedPayments[response.consolidatedPayments.length - 1].getBalance() > 0) {
      notifications.notify(`El estudiante tiene deudas pendientes en el año ${year} en el grado ${grade}`, 'warning')
      closeModal()
      return
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const registerStudent = async () => {
  if (!validateData()) return

  preferenceStore.setLoading(true)
  try {
    const response = await studentStore.registerStudent(student)
    if (response.status === 201) {
      notifications.notify('El estudiante se ha registrado correctamente', 'success')
      closeModal()
      if (preferenceStore.selectedGrade === 0 || preferenceStore.selectedGrade !== parseInt(student.grade)) preferenceStore.setSelectedGrade(parseInt(student.grade))
      else emit('refresh')
    } else {
      notifications.notify('No se pudo registrar el estudiante', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
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

  if (student.registration === '') {
    notifications.notify('Debe ingresar el valor de matrícula del estudiante', 'error')
    return false
  }

  if (student.pension === '') {
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

  if (student.parentSurname === '') {
    notifications.notify('El apellido del acudiente del estudiante no puede estar vacío', 'error')
    return false
  }

  if (student.address === '') {
    notifications.notify('La dirección del estudiante no puede estar vacía', 'error')
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(student.email)) {
    notifications.notify('El correo no es válido', 'error')
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
  student.parentDocumentTypeId = 3
  student.parentDocument = ''
  student.parentName = ''
  student.parentSurname = ''
  student.address = ''
  student.cloudId = ''
}

const closeModal = () => {
  vfm.close('createStudentModal')
}
</script>

