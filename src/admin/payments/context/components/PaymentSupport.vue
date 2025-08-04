<template>
  <div class="soporte-container">
    <div class="print-area" ref="printRef">
      <div class="content-wrapper">
        <!-- Columna izquierda -->
        <div class="left-section">
          <!-- Encabezado -->
          <div class="header">
            <img src="@/assets/img/logo.png" alt="Logo" class="logo" />
            <div class="institution-info">
              <h1>LICEO REY DAVID</h1>
              <p>Prescolar - Primaria - Bachillerato</p>
            </div>
          </div>

          <!-- Detalle del pago -->
          <div class="detalle">
            <h2>Soporte de Pago - N° {{ paymentsStore.selectedPayment.getId() }}</h2>
            <p><strong>Estudiante:</strong> {{ studentsStore.selectedStudent.getName() }}
              {{ studentsStore.selectedStudent.getSurname() }}</p>
            <p><strong>Grado:</strong> {{ studentsStore.selectedStudent.getGrade() }}</p>
            <p><strong>Motivo:</strong> {{ paymentsStore.selectedPayment.getPaymentType() }}</p>
            <p v-if="paymentsStore.selectedPayment.isPension()"><strong>Mes:</strong>
              {{ paymentsStore.selectedPayment.getMonth() }}</p>
            <p><strong>Descripción:</strong> {{ paymentsStore.selectedPayment.getDescription() }}</p>
            <p><strong>Fecha:</strong> {{ paymentsStore.selectedPayment.getDateStr() }}</p>
            <p><strong>Método de pago:</strong> {{ paymentsStore.selectedPayment.getPaymentMethod() }} <span
              v-if="paymentsStore.selectedPayment.getTransferCode()">({{ paymentsStore.selectedPayment.getTransferCode()
              }})</span></p>
            <hr />
            <p style="display: flex; flex-direction: row; justify-content: space-between"><strong>Monto:</strong>
              <strong>$ {{ paymentsStore.selectedPayment.getValueFormatted() }}</strong></p>
          </div>

          <div class="signature">
            <p style="text-align: center; margin-bottom: 0; padding-bottom: 0">
              {{ paymentsStore.selectedPayment.getAuthor() !== 'Automático' ? paymentsStore.selectedPayment.getAuthor() : ''
              }}
            </p>
            <hr style="margin-top: 0.125rem" />
            <p style="text-align: center">Firma y Sello</p>
          </div>
        </div>

        <!-- Columna derecha -->
        <div class="right-section">
          <div class="consolidado">
            <h2 style="text-align: center;">Consolidado Anual</h2>
            <table>
              <thead>
              <tr>
                <th>Mes</th>
                <th>Pagado</th>
                <th>Saldo</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Matrícula</td>
                <td> $ {{ formatCurrencyNumber(consolidatedPayments[0].value) }}</td>
                <td> $ {{ formatCurrencyNumber(consolidatedPayments[0].balance) }}</td>
              </tr>
              <tr v-for="consolidatedPayment in consolidatedPayments.slice(1)" :key="consolidatedPayment.month_id">
                <td>{{ consolidatedPayment.month }}</td>
                <td>$ {{ formatCurrencyNumber(consolidatedPayment.value) }}</td>
                <td>$ {{ formatCurrencyNumber(consolidatedPayment.balance) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import { formatCurrencyNumber } from '@/shared/utils.js'

defineProps({
  consolidatedPayments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['cerrar'])

const paymentsStore = usePaymentStore()
const studentsStore = useStudentStore()

onMounted(() => {
  setTimeout(() => {
    window.print()
    emit('closePaymentSupport')
  }, 500)
})
</script>

<style>
.soporte-container {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
  padding: 2rem;
}

.content-wrapper {
  display: flex;
  gap: 1rem;
  height: 100%;
}

/* Sección izquierda */
.left-section {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #000;
  padding-bottom: 0.5rem;
}

.logo {
  width: 60px;
  height: auto;
  margin-right: 1rem;
}

.institution-info {
  text-align: center;
  flex-grow: 1;
}

.institution-info h1 {
  margin: 0;
  font-size: 1.2rem;
}

.institution-info p {
  margin: 0;
  font-size: 0.9rem;
}

.detalle {
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
}

.detalle h2 {
  font-size: 1rem;
}

.detalle hr {
  margin: 0.5rem 0;
}

.signature {
  font-size: 0.9rem;
  text-align: center;
  padding-top: 5rem;

  hr {
    width: 80%;
  }
}

/* Sección derecha */
.right-section {
  width: 50%;
}

.consolidado {
  font-size: 0.9rem;
}

.consolidado h2 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.consolidado table {
  width: 100%;
  border-collapse: collapse;
}

.consolidado th, .consolidado td {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: center;
  font-size: 0.85rem;
}

@media print {
  @page {
    size: 5.5in 8.5in landscape;
    margin: 1cm;
  }

  body * {
    visibility: hidden !important;
  }

  .print-area, .print-area * {
    visibility: visible !important;
  }

  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .content-wrapper {
    display: flex;
    gap: 1rem;
  }

  .left-section, .right-section {
    width: 50%;
  }
}
</style>