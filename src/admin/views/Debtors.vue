<template>
  <div class="l-standard l-standard--fill debtors-view">
    <div class="l-standard-title">
      <div>
        <span>Lista de deudores</span><span class="container-total">{{ debtors.length }}</span>
      </div>
    </div>

    <div :class="['filters', { 'filters--with-month': debtType === 2 }]">
      <div class="filter">
        <span>Tipo de deuda</span>
        <CustomSelect
          v-model="debtType"
          :options="debtTypeOptions"
          placeholder="Tipo de deuda"
        />
      </div>
      <div v-if="debtType === 2" class="filter">
        <span>Mes</span>
        <CustomSelect
          v-model="debtMonth"
          :options="monthOptions"
          placeholder="Mes"
        />
      </div>
      <div class="filter">
        <span>Grado</span>
        <CustomSelect
          v-model="debtGrade"
          :options="gradeOptions"
          placeholder="Grado"
        />
      </div>
    </div>
    <div class="resumen-container">
      <div class="resumen-item salidas">
        <small class="resumen-label">Deuda filtro</small>
        <span>$ {{ consolidated.selectedTotal }}</span>
      </div>
      <div class="resumen-item salidas">
        <small class="resumen-label">Deuda acumulada</small>
        <span>$ {{ consolidated.allTotal }}</span>
      </div>
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useReportStore } from '@/admin/reports/context/store/reportStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import CustomSelect from '@/admin/shared/components/CustomSelect.vue'

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

const debtTypeOptions = [
  { label: 'Matrícula', value: 1 },
  { label: 'Pensión', value: 2 }
]

const monthOptions = computed(() => [
  { label: 'Todos los meses', value: 0 },
  ...preferenceStore.months.map(month => ({
    label: month.getMonth(),
    value: month.getId()
  }))
])

const gradeOptions = computed(() => [
  { label: 'Todos', value: 0 },
  ...preferenceStore.grades.map(grade => ({
    label: grade.getGrade(),
    value: grade.getId()
  }))
])

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

