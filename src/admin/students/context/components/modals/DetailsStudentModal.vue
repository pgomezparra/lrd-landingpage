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
    <div class="student-modal">
      <div class="student-modal__header">
        <h2>Detalles del estudiante</h2>
      </div>

      <div class="student-modal__content">
        <div class="student-modal__item">
          <p class="label">Tipo de documento</p>
          <p>{{ studentStore.selectedStudent.getDocumentType() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Documento</p>
          <p>{{ studentStore.selectedStudent.getDocument() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Nombres</p>
          <p>{{ studentStore.selectedStudent.getName() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Apellidos</p>
          <p>{{ studentStore.selectedStudent.getSurname() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Edad</p>
          <p>{{ studentStore.selectedStudent.getAge() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Grado</p>
          <p>{{ studentStore.selectedStudent.getGrade() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Valor de matrícula</p>
          <p>$ {{ studentStore.selectedStudent.getRegistrationStr() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Valor de pensión</p>
          <p>$ {{ studentStore.selectedStudent.getPensionStr() }}</p>
        </div>
        <div class="student-modal__item">
          <p class="label">Estado</p>
          <p>{{ studentStore.selectedStudent.isActive() ? 'Activo' : 'Inactivo' }}</p>
        </div>
        <div class="student-modal__item" v-if="studentStore.selectedStudent.getEmail()">
          <p class="label">Correo</p>
          <p>{{ studentStore.selectedStudent.getEmail() }}</p>
        </div>
        <div class="student-modal__item" v-if="studentStore.selectedStudent.getParentDocumentType()">
          <p class="label">Tipo de documento acudiente</p>
          <p>{{ studentStore.selectedStudent.getParentDocumentType() }}</p>
        </div>
        <div class="student-modal__item" v-if="studentStore.selectedStudent.getParentDocument()">
          <p class="label">Documento acudiente</p>
          <p>{{ studentStore.selectedStudent.getParentDocument() }}</p>
        </div>
        <div class="student-modal__item" v-if="studentStore.selectedStudent.getParentName()">
          <p class="label">Nombre acudiente</p>
          <p>{{ studentStore.selectedStudent.getParentName() }}</p>
        </div>
      </div>

      <div class="student-modal__footer">
        <button class="student-modal__btn cancel" @click="closeModal">Cancelar</button>
        <button class="student-modal__btn promote" @click="promoteStudent">Promover</button>
        <!--        <button class="student-modal__btn peace" @click="editStudent">Paz y Salvo</button>-->
        <button class="student-modal__btn edit" @click="editStudent">Editar</button>
      </div>
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

<style scoped>
.student-modal {
  padding: 24px;
  max-width: 700px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.student-modal__header {
  text-align: center;
  margin-bottom: 24px;
}

.student-modal__header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.student-modal__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.student-modal__item {
  background-color: #f8f8f8;
  padding: 12px 16px;
  border-radius: 8px;
}

.student-modal__item .label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 4px;
}

.student-modal__item p {
  margin: 0;
  font-size: 1rem;
  color: #222;
}

.student-modal__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.student-modal__btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.student-modal__btn.cancel {
  background-color: #6c757d;
  color: white;
}

.student-modal__btn.promote {
  background-color: #007bff;
  color: white;
}

.student-modal__btn.peace {
  background-color: #007bff;
  color: white;
}

.student-modal__btn.edit {
  background-color: #007bff;
  color: white;
}
</style>