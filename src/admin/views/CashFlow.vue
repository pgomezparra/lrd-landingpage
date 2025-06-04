<template>
  <loading-overlay />
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
import LoadingOverlay from '@/admin/views/LoadingOverlay.vue'

const reportStore = useReportStore()
const preferenceStore = usePreferenceStore()

const date = ref(new Date())
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

watch(
  () => preferenceStore.selectedYear,
  () => {
    loadReport()
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

onMounted(async () => {
  if (!preferenceStore.selectedYear) return
  await loadReport()
})
</script>

<style scoped>
.subtitulo {
  margin: 0;
}

.cards-container-cash-flow {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 45dvh;
  overflow-y: scroll;
}
</style>
