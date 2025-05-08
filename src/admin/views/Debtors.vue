<template>
  <div class="consulta-container">
    <h2 class="title">Lista de deudores ({{ debtors.length }})</h2>

    <div class="filters">
      <div class="filter">
        <span>Tipo de deuda</span>
        <select v-model="debtType">
          <option disabled :value="0">Seleccionar</option>
          <option :value="1">Matrícula</option>
          <option :value="2">Pensión</option>
        </select>
      </div>
      <div class="filter" v-if="debtType === 2">
        <span>Mes</span>
        <select v-model="debtMonth">
          <option :value="0">Mes</option>
          <option
            v-for="month in preferenceStore.months"
            :key="month.getId()"
            :value="month.getId()"
          >{{ month.getMonth() }}
          </option>
        </select>
      </div>
      <div class="filter">
        <span>Grado</span>
        <select v-model="debtGrade">
          <option :value="0">Todos</option>
          <option
            v-for="grade in preferenceStore.grades"
            :key="grade.getId()"
            :value="grade.getId()"
          >{{ grade.getGrade() }}
          </option>
        </select>
      </div>
    </div>
    <div class="resumen-container">
      <div class="resumen-item salidas">Deuda filtro: <span>$ {{ consolidated.selectedTotal }}</span></div>
      <div class="resumen-item salidas">Deuda acumulada: <span>$ {{ consolidated.allTotal }}</span></div>
    </div>

    <div class="cards-container">
      <div class="movimiento-card" v-for="debtor in debtors" :key="debtor.getId()">
        <div class="card-header">
          <div class="valor-metodo">
            <span class="salidas">
              ${{ debtor.getBalanceStr() }}
            </span>
            <span class="negativo">(${{ debtor.getTotalBalanceStr() }})</span>
          </div>
        </div>

        <div class="descripcion">
          {{ debtor.getName() }} {{ debtor.getGrade() }}
        </div>
      </div>
      <div v-if="debtors.length === 0" class="movimiento-card vacio">
        <div class="card-header">
          <div class="fecha">Sin deudores</div>
        </div>
        <div class="descripcion">
          No hay deudores para los filtros seleccionados.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useReportStore } from '@/admin/reports/context/store/reportStore.js'
import { format } from '@formkit/tempo'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const reportStore = useReportStore()
const preferenceStore = usePreferenceStore()

const debtType = ref(0)
const debtMonth = ref(0)
const debtGrade = ref(0)
const debtors = ref([])
const consolidated = reactive({
  selectedTotal: 0,
  allTotal: 0
})

watch(debtGrade, () => {
  loadReport()
})

watch(debtMonth, () => {
  loadReport()
})

watch(debtType, () => {
  loadReport()
})

watch(
  () => preferenceStore.selectedYear,
  () => {
    loadReport()
  }
)

const loadReport = async () => {
  try {
    if (debtType.value === 0) return
    if (debtType.value === 2 && debtMonth.value === 0) return

    const response = await reportStore.getDebtors(debtMonth.value, debtGrade.value, debtType.value)

    consolidated.selectedTotal = response.consolidated.getBalanceStr()
    consolidated.allTotal = response.consolidated.getTotalBalanceStr()

    debtors.value = response.debtors
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

onMounted(async () => {
  if (!preferenceStore.selectedYear) return
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

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter {
  display: flex;
  gap: 0.5rem;
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

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 70dvh;
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