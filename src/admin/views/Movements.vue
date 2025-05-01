<template>
  <div>
    <h1>Listado de movimientos</h1>
    <div>
      <p>Mes</p>
      <select v-model="selectedMonth">
        <option
          v-for="month in preferencesStore.months"
          :key="month.getId()"
          :value="month.getId()"
        >
          {{ month.getMonth() }}
        </option>
      </select>
      <button>Registrar</button>
    </div>
    <div v-if="movements.length > 0" style="margin-top: 2rem;height: 80dvh; width: 100%; overflow-x: scroll">
      <div v-for="(movement, index) in movements" :key="index">
        <p>{{ index + 1 }}</p>
        <p>{{ movement.getDateStr() }}</p>
        <p>{{ movement.getMovementType() }}</p>
        <p>{{ movement.getDescription() }}</p>
        <p>$ {{ movement.getValueFormatted() }}</p>
        <p>{{ movement.getMovementMethod() }}</p>
        <button>Editar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { onMounted, ref, watch } from 'vue'
import { date, format, monthEnd, monthStart } from '@formkit/tempo'
import { useMovementStore } from '@/admin/movements/context/store/movementStore.js'

const preferencesStore = usePreferenceStore()
const movementsStore = useMovementStore()

const selectedMonth = ref(0)
const movements = ref([])

watch(() => preferencesStore.months, (newYear) => {
  selectedMonth.value = new Date().getMonth() + 1
})

watch(() => selectedMonth.value, (newMonth) => {
  searchMovements()
})

watch(() => preferencesStore.selectedYear, (newMovement) => {
  if (!selectedMonth.value) return
  searchMovements()
})

const searchMovements = async () => {
  try {
    const baseDate = date(`${preferencesStore.selectedYear}-${selectedMonth.value.toString().padStart(2, '0')}-01`)
    const initMont = monthStart(baseDate)
    const endMonth = monthEnd(baseDate)

    movements.value = await movementsStore.searchMovements(format(initMont, 'YYYY-MM-DD'), format(endMonth, 'YYYY-MM-DD'))
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

onMounted(() => {
  if (preferencesStore.months.length > 0) selectedMonth.value = new Date().getMonth() + 1
})
</script>