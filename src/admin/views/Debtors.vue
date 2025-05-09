<template>
  <div class="consulta-container">
    <h2 class="title">Lista de deudores ({{ debtors.length }})</h2>

    <div class="filters">
      <div class="filter">
        <span>Tipo de deuda</span>
        <select class="select-standard" v-model="debtType">
          <option disabled :value="0">Seleccionar</option>
          <option :value="1">Matrícula</option>
          <option :value="2">Pensión</option>
        </select>
      </div>
      <div class="filter" v-if="debtType === 2">
        <span>Mes</span>
        <select class="select-methods" v-model="debtMonth">
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
        <select class="select-document" v-model="debtGrade">
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

