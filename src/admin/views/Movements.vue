<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <div>
        <span>Listado de movimientos</span><span class="container-total">{{ filteredMovements.length }}</span>
      </div>
      <p class="l-standard-title__text">Selecciona el mes a consultar</p>
    </div>
    <div v-if="filteredMovements.length > 0" class="summary-movements">
      <div class="summary-item ingresos">
        <span class="summary-label">Ingresos</span>
        <span class="summary-value">{{ formatValue(totalIngresos) }}</span>
      </div>
      <div class="summary-item salidas">
        <span class="summary-label">Salidas</span>
        <span class="summary-value">{{ formatValue(totalSalidas) }}</span>
      </div>
    </div>
    <div class="header-movements">
      <div class="controls">
        <CustomSelect
          v-model="selectedMonth"
          :options="monthOptions"
          label-key="label"
          value-key="value"
          placeholder="Selecciona el mes"
        />
        <input ref="filterInputRef" v-model="filterText" class="filter-input" placeholder="Filtrar movimientos..." />
        <button class="button-edit" @click="addMovement">Registrar movimiento</button>
      </div>
    </div>
    <div v-if="filteredMovements.length > 0" class="movements-list">
      <div v-for="(movement, index) in filteredMovements" :key="index" @click="editMovement(movement)" class="movement-card">
        <div class="movement-info">
          <span class="date">{{ movement.getDateStr() }}</span>
          <div :class="['type', !movement.isIngress() ? 'salida' : 'entrada']">
            {{ movement.getMovementType() }}
          </div>
          <div class="description">{{ movement.getDescription() }}</div>
          <div class="origin">{{ movement.getMovementMethod() }}</div>
        </div>
        <div class="movement-amount">
          <span :class="['amount', !movement.isIngress() ? 'salida' : 'entrada']">${{ movement.getValueFormatted() }}</span>
        </div>
      </div>
    </div>
  </div>
  <create-movement-modal @refresh="searchMovements" />
  <edit-movement-modal @refresh="searchMovements" />
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { date, format, monthEnd, monthStart } from '@formkit/tempo'
import { useMovementStore } from '@/admin/movements/context/store/movementStore.js'
import CreateMovementModal from '@/admin/movements/context/components/modals/CreateMovementModal.vue'
import EditMovementModal from '@/admin/movements/context/components/modals/EditMovementModal.vue'
import { useVfm } from 'vue-final-modal'
import LoadingOverlay from '@/admin/views/LoadingOverlay.vue'
import CustomSelect from '@/admin/shared/components/CustomSelect.vue'

const preferencesStore = usePreferenceStore()
const movementsStore = useMovementStore()
const vfm = useVfm()

const selectedMonth = ref(0)
const movements = ref([])
const filterText = ref('')
const filterInputRef = ref(null)

const filteredMovements = computed(() => {
  if (!filterText.value) return movements.value
  const term = filterText.value.toLowerCase()
  return movements.value.filter(m =>
    m.getDescription().toLowerCase().includes(term) ||
    m.getMovementType().toLowerCase().includes(term) ||
    m.getMovementMethod().toLowerCase().includes(term) ||
    m.getValueFormatted().toLowerCase().includes(term) ||
    m.getDateStr().toLowerCase().includes(term)
  )
})

const monthOptions = computed(() => {
  return preferencesStore.months.map(month => ({
    label: month.getMonth(),
    value: month.getId()
  }))
})

const totalIngresos = computed(() => {
  return filteredMovements.value
    .filter(m => m.isIngress())
    .reduce((sum, m) => sum + m.getValue(), 0)
})

const totalSalidas = computed(() => {
  return filteredMovements.value
    .filter(m => !m.isIngress())
    .reduce((sum, m) => sum + m.getValue(), 0)
})

const formatValue = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}

watch(() => preferencesStore.months, (newYear) => {
  selectedMonth.value = new Date().getMonth() + 1
})

watch(() => selectedMonth.value, async (newMonth) => {
  await searchMovements()
  filterText.value = ''
  nextTick(() => filterInputRef.value?.focus())
})

watch(() => preferencesStore.selectedYear, (newMovement) => {
  if (!selectedMonth.value) return
  searchMovements()
})

const searchMovements = async () => {
  preferencesStore.setLoading(true)
  try {
    const baseDate = date(`${preferencesStore.selectedYear}-${selectedMonth.value.toString().padStart(2, '0')}-01`)
    const initMont = monthStart(baseDate)
    const endMonth = monthEnd(baseDate)

    movements.value = await movementsStore.searchMovements(format(initMont, 'YYYY-MM-DD'), format(endMonth, 'YYYY-MM-DD'))
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferencesStore.setLoading(false)
  }
}

const addMovement = () => {
  vfm.open('createMovementModal')
}

const editMovement = (movement) => {
  movementsStore.setSelectedMovement(movement)
  vfm.open('editMovementModal')
}

onMounted(() => {
  if (preferencesStore.months.length > 0) selectedMonth.value = new Date().getMonth() + 1
})
</script>
