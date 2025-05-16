<template>
  <VueFinalModal
    modal-id="editStudentModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
  >
    <div>
      <p class="modal-title">Editar estudiante</p>
      <div class="modal-body">
        <div class="container-form-edit">
          <div class="form-group">
            <p>Tipo de documento</p>
            <select class="select-methods" v-model="student.documentType">
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
              maxlength="20"
            />
          </div>
        </div>
        <div class="form-group">
          <p>Nombres</p>
          <input
            v-model="student.name"
            type="text"
            placeholder="Nombre"
            maxlength="30"
          />
        </div>
        <div class="form-group">
          <p>Apellidos</p>
          <input
            v-model="student.surname"
            type="text"
            placeholder="Apellido"
            maxlength="30"
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
            <select class="select-document" v-model="student.grade">
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
        <div class="form-group">
          <p>Estado</p>
          <select class="select-document" v-model="student.active">
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>
        <div class="form-group">
          <p>Correo</p>
          <input
            type="text"
            placeholder="Correo"
            v-model="student.email"
            maxlength="40"
          />
        </div>
        <div class="container-form-edit">
          <div class="form-group">
            <p>Tipo de documento</p>
            <select class="select-methods" v-model="student.parentDocumentTypeId">
              <option disabled value="0">Tipo de documento</option>
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
        <button class="button-edit" @click="updateStudent">Actualizar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { reactive } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const preferenceStore = usePreferenceStore()

const emit = defineEmits(['changeActive', 'refresh'])

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

const beforeOpen = () => {
  clearInputs()
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
  if (studentStore.selectedStudent.getEmail()) student.email = studentStore.selectedStudent.getEmail()
  student.active = studentStore.selectedStudent.isActive()
  student.year = studentStore.selectedStudent.getYear()
  if (studentStore.selectedStudent.getParentDocumentTypeId()) student.parentDocumentTypeId = studentStore.selectedStudent.getParentDocumentTypeId()
  if (studentStore.selectedStudent.getParentDocument()) student.parentDocument = studentStore.selectedStudent.getParentDocument()
  if (studentStore.selectedStudent.getParentName()) student.parentName = studentStore.selectedStudent.getParentName()
}

const updateStudent = async () => {
  preferenceStore.setLoading(true)
  try {
    const response = await studentStore.updateStudent(student)
    if (response.status === 200) {
      notifications.notify('El estudiante se ha actualizado correctamente', 'success')
      closeModal()
      if (preferenceStore.selectedGrade === 0 && student.active) {
        emit('changeActive')
        preferenceStore.setSelectedGrade(parseInt(student.grade))
      } else {
        emit('refresh')
      }
    } else {
      notifications.notify('No se pudo actualizar el estudiante', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const clearInputs = () => {
  student.id = 0
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
  vfm.close('editStudentModal')
}

</script>


