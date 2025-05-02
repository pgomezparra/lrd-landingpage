<template>
  <div class="movements-container">
    <div class="header-movements">
      <h2>
        Listado de movimientos
        <span class="total">({{ movements.length }})</span>
      </h2>
      <div class="controls">
        <select v-model="selectedMonth">
          <option
            v-for="month in preferencesStore.months"
            :key="month.getId()"
            :value="month.getId()"
          >
            {{ month.getMonth() }}
          </option>
        </select>
        <button class="btn" @click="addMovement">Registrar movimiento</button>
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

<style scoped>
.movements-container {
  width: 50rem;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 90dvh;
}

.header-movements {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-movements h2 {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.total {
  font-weight: normal;
  color: #555;
  margin-left: 0.5rem;
}

.controls {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
}

select {
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  width: 60%;
}

.btn {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #004c99;
}

.movements-list {
  height: 80dvh;
  width: 100%;
  overflow-y: scroll;
}

.movement-card {
  border: 1px solid #ddd;
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 0.8rem;
  background-color: #fafafa;
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.date {
  color: #555;
}

.amount {
  font-weight: bold;
  color: #222;
}

.type {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.salida {
  color: #c0392b;
}

.entrada {
  color: #27ae60;
}

.description {
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}

.origin {
  font-size: 0.8rem;
  color: #888;
}
</style>