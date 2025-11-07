<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>Consulta Diaria</p>
    </div>

    <div class="fecha-selector">
      <label for="fecha">Fecha:</label>
      <Datepicker
        v-model="date"
        :autoApply="true"
        :enable-time-picker="false"
        :format="'yyyy-MM-dd'"
        locale="es"
        :maxDate="new Date()"
        :clearable="false"
      />
    </div>

    <div class="resumen-container">
      <div class="resumen-item ingresos">Ingresos: <span>$ {{ consolidated.inflows }}</span></div>
      <div class="resumen-item salidas">Salidas: <span>$ {{ consolidated.outflows }}</span></div>
      <div
        class="resumen-item"
        :class="parseInt(consolidated.balance) > 0 ? 'saldo-positivo' : 'saldo-negativo'"
      >Saldo: <span>$ {{ consolidated.balance }}</span></div>
      <div class="resumen-item efectivo">Efectivo: <span>$ {{ consolidated.cash }}</span></div>
      <div class="resumen-item transferencia">Transferencia: <span>$ {{ consolidated.transfer }}</span></div>
    </div>

    <h3 class="subtitulo">Movimientos del Día ({{ movements.length }})</h3>
    <div class="cards-container-cash-flow">
      <div class="movimiento-card" v-for="movement in movements" :key="movement.getId()">
        <div class="card-header">
          <div class="fecha">{{ movement.getDateStr() }}</div>
          <div class="valor-metodo">
            <span :class="movement.getMovementType() === 'Ingreso' ? 'positivo' : 'negativo'">
              ${{ movement.getValueStr() }}
            </span>
            <span class="metodo">({{ movement.getMovementMethod() }})</span>
          </div>
        </div>

        <div class="descripcion">
          {{ movement.getDescription() }}{{ movement.getStudent() ? ` (${movement.getStudent()})` : '' }}
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <div v-if="movement.getMonth()" class="mes-destacado">
            Mes: {{ movement.getMonth() }}
          </div>
          <div v-if="movement.getGrade()" class="mes-destacado">
            Grado: {{ movement.getGrade() }}
          </div>
          <div v-if="movement.getStudent() && !movement.getElectronicInvoice()" class="bill-chip"
               @click="openBillModal(movement)">
            Facturar
          </div>
        </div>
      </div>
      <div v-if="movements.length === 0" class="movimiento-card vacio">
        <div class="card-header">
          <div class="fecha">Sin movimientos</div>
        </div>
        <div class="descripcion">
          No se han registrado movimientos en este día.
        </div>
      </div>
    </div>
  </div>
  <create-electronic-invoice-modal :data="invoiceData" @refresh="loadReport" @clear="clearInvoice" />
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import { useReportStore } from '@/admin/reports/context/store/reportStore.js'
import { format } from '@formkit/tempo'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { usePaymentStore } from '@/admin/payments/context/store/paymentStore.js'
import CreateElectronicInvoiceModal from '@/admin/payments/context/components/modals/CreateElectronicInvoiceModal.vue'
import { notifications } from '@/shared/notifications.js'
import { useVfm } from 'vue-final-modal'

const reportStore = useReportStore()
const preferenceStore = usePreferenceStore()
const paymentsStore = usePaymentStore()

const vfm = useVfm()

const date = ref(new Date())
const movements = ref([])
const consolidated = reactive({
  inflows: 0,
  outflows: 0,
  balance: 0,
  cash: 0,
  transfer: 0
})
const invoiceData = reactive({
  identification: '',
  id: 0,
  price: 0,
  observations: ''
})

watch(date, () => {
  loadReport()
})

watch(
  () => preferenceStore.selectedYear,
  async () => {
    await loadReport()
    if (paymentsStore.externalProducts.length === 0) await paymentsStore.getExternalProducts()
  }
)

const loadReport = async () => {
  preferenceStore.setLoading(true)
  try {
    const response = await reportStore.dailyCash(format(date.value, 'YYYY-MM-DD'), format(date.value, 'YYYY-MM-DD'))

    consolidated.inflows = response.consolidated.getInflowsStr()
    consolidated.outflows = response.consolidated.getOutflowsStr()
    consolidated.balance = response.consolidated.getBalanceStr()
    consolidated.cash = response.consolidated.getCashStr()
    consolidated.transfer = response.consolidated.getTransferStr()

    movements.value = response.movements
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const openBillModal = (movement) => {
  if (!movement.getStudentCloudId()) {
    notifications.notify('Debe actualizar la información del estudiante para poder generar una factura electrónica', 'error')
    return
  }

  if (movement.getElectronicInvoice()) {
    notifications.notify('Este pago ya tiene factura electrónica', 'error')
    return
  }

  invoiceData.identification = movement.getParentDocument()
  invoiceData.id = movement.getId()
  invoiceData.price = movement.getValue()
  invoiceData.observations = movement.getDescription()
  vfm.open('createElectronicInvoiceModal')
}

const clearInvoice = () => {
  invoiceData.identification = ''
  invoiceData.id = 0
  invoiceData.price = 0
  invoiceData.observations = ''
}

onMounted(async () => {
  if (!preferenceStore.selectedYear) return
  await loadReport()
  if (paymentsStore.externalProducts.length === 0) await paymentsStore.getExternalProducts()
})
</script>

