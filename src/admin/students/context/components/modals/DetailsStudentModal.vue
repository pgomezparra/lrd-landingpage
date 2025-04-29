<template>
  <VueFinalModal
    modal-id="detailsStudentModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
  >
    <div>
      <div>
        <p>Detalles del estudiante</p>
      </div>
      <div>
        <div>
          <p>Tipo de documento</p>
          <p>{{ studentStore.selectedStudent.getDocumentType() }}</p>
        </div>
        <div>
          <p>Documento</p>
          <p>{{ studentStore.selectedStudent.getDocument() }}</p>
        </div>
        <div>
          <p>Nombres</p>
          <p>{{ studentStore.selectedStudent.getName() }}</p>
        </div>
        <div>
          <p>Apellidos</p>
          <p>{{ studentStore.selectedStudent.getSurname() }}</p>
        </div>
        <div>
          <p>Edad</p>
          <p>{{ studentStore.selectedStudent.getAge() }}</p>
        </div>
        <div>
          <p>Grado</p>
          <p>{{ studentStore.selectedStudent.getGrade() }}</p>
        </div>
        <div>
          <p>Valor de matrícula</p>
          <p>$ {{ studentStore.selectedStudent.getRegistrationStr() }}</p>
        </div>
        <div>
          <p>Valor de pensión</p>
          <p>$ {{ studentStore.selectedStudent.getPensionStr() }}</p>
        </div>
        <div>
          <p>Estado</p>
          <p>{{ studentStore.selectedStudent.isActive() ? 'Activo' : 'Inactivo' }}</p>
        </div>
        <div>
          <p>Correo</p>
          <p>{{ studentStore.selectedStudent.getEmail() }}</p>
        </div>
        <div>
          <p>Tipo de documento acudiente</p>
          <p>{{ studentStore.selectedStudent.getParentDocumentType() }}</p>
        </div>
        <div>
          <p>Documento acudiente</p>
          <p>{{ studentStore.selectedStudent.getParentDocument() }}</p>
        </div>
        <div>
          <p>Nombre acudiente</p>
          <p>{{ studentStore.selectedStudent.getParentName() }}</p>
        </div>
      </div>
      <button class="button-edit" @click="closeModal">
        Cancelar
      </button>
      <button class="button-edit" @click="promoteStudent">
        Promover
      </button>
      <button class="button-edit" @click="editStudent">
        Paz y Salvo
      </button>
      <button class="button-edit" @click="editStudent">
        Editar
      </button>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { notifications } from '@/shared/notifications.js'

const vfm = useVfm()
const studentStore = useStudentStore()
const preferenceStore = usePreferenceStore()
const paymentsStore = usePaymentStore()

const editStudent = () => {
  vfm.close('detailsStudentModal')
  vfm.open('editStudentModal')
}

const promoteStudent = async () => {
  try {
    const paymentsResponse = await paymentsStore.searchPayments(studentStore.selectedStudent.getId())
    if (paymentsResponse.consolidatedPayments.length === 0) {
      notifications.notify('No se pudieron consultar los pagos del estudiante', 'error')
      return
    }
    if (paymentsResponse.consolidatedPayments[paymentsResponse.consolidatedPayments.length - 1].getBalance() > 0) {
      notifications.notify('El estudiante tiene un saldo pendiente', 'error')
      return
    }

    const response = await studentStore.promoteStudent(studentStore.selectedStudent)
    if (response.status === 200) {
      closeModal()
      const nextGrade = preferenceStore.grades.find(grade => grade.getId() === studentStore.selectedStudent.getGradeId())
      preferenceStore.setSelectedYear(studentStore.selectedStudent.getYear() + 1)
      preferenceStore.setSelectedGrade(nextGrade.getNextGradeId())
      studentStore.setSelectedStudent(null)
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

const closeModal = () => {
  vfm.close('detailsStudentModal')
}

</script>
