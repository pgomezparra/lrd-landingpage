<template>
  <VueFinalModal
    modal-id="editStudentModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @opened="onOpened"
  >
    <div>
      <div>
        <p>Editar usuario</p>
      </div>
      <div>
        <div>
          <p>Nombre</p>
          <input
            :value="student.name"
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Apellido</p>
          <input
            v-model="student.surname"
            type="text"
            placeholder="Apellido"
          >
        </div>
        <div>
          <p>Tipo de documento</p>
          <select class="select-standard" v-model="student.documentType">
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
          >
        </div>
        <div>
          <p>Grado</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Valor de matrícula</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Valor de pensión</p>
          <input
            type="text"
            placeholder="Nombre"
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
import { reactive } from 'vue'

const vfm = useVfm()
const studentStore = useStudentStore()

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

const onOpened = () => {
  console.log('onOpened', studentStore.selectedStudent)
  student.name = studentStore.selectedStudent.getName()
  student.surname = studentStore.selectedStudent.getSurname()
  student.documentType = studentStore.selectedStudent.getDocumentType()
  student.document = studentStore.selectedStudent.getDocument()
  // student.registration = studentStore.selectedStudent.getRegistration()
  // student.pension = studentStore.selectedStudent.getPension()
}

const closeModal = () => {
  vfm.close('editStudentModal')
}

</script>
