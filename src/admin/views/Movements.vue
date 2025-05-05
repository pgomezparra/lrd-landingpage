<template>
  <div class="l-standard">
    <div class="header-movements">
      <h2>
        Listado de movimientos
        <span class="container-total">{{ movements.length }}</span>
      </h2>
      <div class="controls">
        <select class="select-standard" v-model="selectedMonth">
          <option
            v-for="month in preferencesStore.months"
            :key="month.getId()"
            :value="month.getId()"
          >
            {{ month.getMonth() }}
          </option>
        </select>
        <button class="button-edit" @click="addMovement">Registrar movimiento</button>
      </div>
    </div>
    <div v-if="movements.length > 0" class="movements-list">
      <div v-for="(movement, index) in movements" :key="index" @click="editMovement(movement)" class="movement-card">
        <div class="card-header">
          <span class="date">{{ movement.getDateStr() }}</span>
          <span class="amount">${{ movement.getValueFormatted() }}</span>
        </div>
        <div :class="['type', !movement.isIngress() ? 'salida' : 'entrada']">
          {{ movement.getMovementType() }}
        </div>
        <div class="description">{{ movement.getDescription() }}</div>
        <div class="origin">{{ movement.getMovementMethod() }}</div>
      </div>
    </div>
  </div>
  <create-movement-modal @refresh="searchMovements" />
  <edit-movement-modal @refresh="searchMovements" />
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { onMounted, ref, watch } from 'vue'
import { date, format, monthEnd, monthStart } from '@formkit/tempo'
import { useMovementStore } from '@/admin/movements/context/store/movementStore.js'
import CreateMovementModal from '@/admin/movements/context/components/modals/CreateMovementModal.vue'
import EditMovementModal from '@/admin/movements/context/components/modals/EditMovementModal.vue'
import { useVfm } from 'vue-final-modal'

const preferencesStore = usePreferenceStore()
const movementsStore = useMovementStore()
const vfm = useVfm()

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
