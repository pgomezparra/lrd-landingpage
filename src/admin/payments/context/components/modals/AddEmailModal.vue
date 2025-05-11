<template>
  <VueFinalModal
    modal-id="addEmailModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
    @opened="onOpen"
    @closed="onClosed"
  >
    <div>
      <p class="modal-title">Agregar correo</p>
      <div class="modal-body">
        <div class="container-form-edit">
          <div class="form-group">
            <p>Correo</p>
            <input
              type="text"
              placeholder="Correo"
              v-model="student.email"
              maxlength="40"
              ref="email"
            />
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="updateEmail">Guardar y enviar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { nextTick, reactive, ref } from 'vue'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const preferenceStore = usePreferenceStore()

const emit = defineEmits(['sendEmail'])

const email = ref(null)


const student = reactive({
  id: 0,
  documentType: '',
  document: '',
  name: '',
  surname: '',
  age: '',
  grade: 0,
  registration: 0,
  pension: 0,
  email: '',
  active: false,
  year: preferenceStore.selectedYear,
  parentDocumentTypeId: 0,
  parentDocument: '',
  parentName: ''
})

const updateEmail = async () => {
  if (!validateData()) return

  try {
    const response = await studentStore.updateStudent(student)
    if (response.status === 200) {
      studentStore.selectedStudent.setEmail(student.email)
      emit('sendEmail')
    }
  } catch (error) {
    notifications.notify(error.response.data.message, 'error')
  } finally {
    closeModal()
  }
}

const validateData = () => {
  if (student.email === '') {
    notifications.notify('Debe ingresar el correo del estudiante', 'error')
    return false
  }

  return true
}

const beforeOpen = () => {
  if (!studentStore.selectedStudent) return
  student.id = studentStore.selectedStudent.getId()
  student.documentType = studentStore.selectedStudent.getDocumentTypeId()
  student.document = studentStore.selectedStudent.getDocument()
  student.name = studentStore.selectedStudent.getName()
  student.surname = studentStore.selectedStudent.getSurname()
  student.age = studentStore.selectedStudent.getAge()
  student.grade = studentStore.selectedStudent.getGradeId()
  student.registration = studentStore.selectedStudent.getRegistration()
  student.pension = studentStore.selectedStudent.getPension()
  if (studentStore.selectedStudent.hasEmail()) student.email = studentStore.selectedStudent.getEmail()
  student.active = studentStore.selectedStudent.isActive()
  student.year = studentStore.selectedStudent.getYear()
  if (studentStore.selectedStudent.getParentDocumentTypeId()) student.parentDocumentTypeId = studentStore.selectedStudent.getParentDocumentTypeId()
  if (studentStore.selectedStudent.getParentDocument()) student.parentDocument = studentStore.selectedStudent.getParentDocument()
  if (studentStore.selectedStudent.getParentName()) student.parentName = studentStore.selectedStudent.getParentName()
}

const onOpen = () => {
  nextTick(() => {
    email.value.focus()
  })
}

const onClosed = () => {
  student.id = 0
  student.documentType = ''
  student.document = ''
  student.name = ''
  student.surname = ''
  student.age = ''
  student.grade = 0
  student.registration = 0
  student.pension = 0
  student.email = ''
  student.year = preferenceStore.selectedYear
  student.active = false
  student.parentDocumentTypeId = 0
  student.parentDocument = ''
  student.parentName = ''
}

const closeModal = () => {
  vfm.close('addEmailModal')
}
</script>
