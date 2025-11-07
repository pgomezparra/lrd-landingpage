<template>
  <VueFinalModal
    modal-id="detailsStudentModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
  >
    <div class="student-modal">
      <div class="student-modal__close">
        <div class="close" @click="closeModal">
          <img src="@/assets/img/general/close.svg" alt="close" />
        </div>
      </div>
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
        <div
          class="student-modal__item"
          v-if="studentStore.selectedStudent.getParentDocumentType()"
        >
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
        <div class="student-modal__item" v-if="studentStore.selectedStudent.getParentSurname()">
          <p class="label">Apellidos acudiente</p>
          <p>{{ studentStore.selectedStudent.getParentSurname() }}</p>
        </div>
        <div class="student-modal__item" v-if="studentStore.selectedStudent.getAddress()">
          <p class="label">Dirección</p>
          <p>{{ studentStore.selectedStudent.getAddress() }}</p>
        </div>
      </div>

      <div class="student-modal__footer">
        <button class="student-modal__btn edit" @click="editStudent">Editar</button>
        <button class="student-modal__btn promote" @click="promoteStudent">Promover</button>
        <button class="student-modal__btn peace" @click="validateDebt">Paz y Salvo</button>
      </div>
    </div>
  </VueFinalModal>
  <no-debt-certificate v-if="showCertificate" @closeCertificate="showCertificate = false" />
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { notifications } from '@/shared/notifications.js'
import NoDebtCertificate from '@/admin/students/context/components/NoDebtCertificate.vue'
import { computed, ref } from 'vue'

const vfm = useVfm()
const studentStore = useStudentStore()
const preferenceStore = usePreferenceStore()
const paymentsStore = usePaymentStore()
const theme = computed(() => preferenceStore.theme)

const showCertificate = ref(false)

const editStudent = () => {
  vfm.close('detailsStudentModal')
  vfm.open('editStudentModal')
}

const validateDebt = async () => {
  preferenceStore.setLoading(true)
  try {
    const paymentsResponse = await paymentsStore.searchPayments(
      studentStore.selectedStudent.getId()
    )
    if (paymentsResponse.consolidatedPayments.length === 0) {
      notifications.notify('No se pudieron consultar los pagos del estudiante', 'error')
      return
    }
    if (
      paymentsResponse.consolidatedPayments[
        paymentsResponse.consolidatedPayments.length - 1
      ].getBalance() > 0
    ) {
      notifications.notify('El estudiante tiene un saldo pendiente', 'error')
      return
    }

    showCertificate.value = true
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const promoteStudent = async () => {
  preferenceStore.setLoading(true)
  try {
    const paymentsResponse = await paymentsStore.searchPayments(
      studentStore.selectedStudent.getId()
    )
    if (paymentsResponse.consolidatedPayments.length === 0) {
      notifications.notify('No se pudieron consultar los pagos del estudiante', 'error')
      return
    }
    if (
      paymentsResponse.consolidatedPayments[
        paymentsResponse.consolidatedPayments.length - 1
      ].getBalance() > 0
    ) {
      notifications.notify('El estudiante tiene un saldo pendiente', 'error')
      return
    }

    const response = await studentStore.promoteStudent(studentStore.selectedStudent)
    if (response.status === 200) {
      closeModal()
      const nextGrade = preferenceStore.grades.find(
        (grade) => grade.getId() === studentStore.selectedStudent.getGradeId()
      )
      preferenceStore.setSelectedYear(studentStore.selectedStudent.getYear() + 1)
      preferenceStore.setSelectedGrade(nextGrade.getNextGradeId())
      studentStore.setSelectedStudent(null)
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const closeModal = () => {
  vfm.close('detailsStudentModal')
}
</script>

<style scoped>

</style>
