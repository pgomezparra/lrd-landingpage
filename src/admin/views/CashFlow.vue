<template>
  <div class="consulta-container">
    <h2 class="title">Consulta Diaria</h2>

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

    <h3 class="subtitulo">Movimientos del Día</h3>
    <div class="cards-container">
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

        <div v-if="movement.getMonth()" class="mes-destacado">
          Mes: {{ movement.getMonth() }}
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
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import { useReportStore } from '@/admin/reports/context/store/reportStore.js'
import { format } from '@formkit/tempo'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const reportStore = useReportStore()
const preferenceStore = usePreferenceStore()

const date = ref(null)
const movements = ref([])
const consolidated = reactive({
  inflows: 0,
  outflows: 0,
  balance: 0,
  cash: 0,
  transfer: 0
})

watch(date, () => {
  loadReport()
})

watch(preferenceStore.selectedYear, () => {
  loadReport()
})

const loadReport = async () => {
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
  }
}

onMounted(async () => {
  if (!preferenceStore.selectedYear) return
  date.value = new Date()
  await loadReport()
})
</script>

<style scoped>
.consulta-container {
  width: 50rem;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 90dvh;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin: 0 auto 0.5rem;
}

.fecha-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.resumen-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.resumen-item {
  font-size: 1.2rem;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
}

.resumen-item span {
  display: block;
  font-size: 1.5rem;
  margin-top: 0.2rem;
}

.ingresos span,
.efectivo span,
.saldo-positivo span {
  color: green;
}

.salidas span,
.saldo-negativo span {
  color: red;
}

.transferencia span {
  color: blue;
}

.subtitulo {
  margin-top: 0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 50dvh;
  overflow-y: scroll;
}

.movimiento-card.vacio {
  text-align: center;
  opacity: 0.6;
  font-style: italic;
}

.movimiento-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fecha {
  color: #4b5563;
  font-size: 0.9rem;
}

.valor-metodo {
  text-align: right;
  display: flex;
  align-items: flex-end;
  gap: 0.1rem;
}

.positivo {
  color: green;
}

.negativo {
  color: red;
}

.metodo {
  font-size: 0.85rem;
  color: #6b7280;
}

.descripcion {
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 500;
}

.mes-destacado {
  background-color: #f3f4f6;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
  width: fit-content;
}
</style>