<template>
  <VueFinalModal
    modal-id="resultsModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @opened="onOpened"
  >
    <div>
      <p class="modal-title">Resultados elección</p>

      <div class="modal-body">
        <div class="data-container">
          <p>Total de votos: {{ total }}</p>
          <!--          <div class="charts">-->
          <div class="chart-card">
            <h4>Resultados Personería</h4>

            <p v-for="(c, i) in ombudsman" :key="i" class="text-result">
              {{ c.getName() }}: {{ c.getVotes() }}
            </p>

            <div class="chart-wrapper">
              <Bar
                :key="personeriaKey"
                :data="personeriaChartData"
                :options="chartOptions"
              />
            </div>
          </div>

          <div class="chart-card">
            <h4>Resultados Contraloría</h4>
            <p v-for="(c, i) in comptroller" :key="i" class="text-result">
              {{ c.getName() }}: {{ c.getVotes() }}
            </p>
            <div class="chart-wrapper">
              <Bar
                :key="contraloriaKey"
                :data="contraloriaChartData"
                :options="chartOptions"
              />
            </div>
          </div>
          <!--          </div>-->
        </div>
      </div>
      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cerrar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { computed, markRaw, nextTick, reactive, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { useElectionsStore } from '@/admin/content/elections/context/store/electionsStore.js'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const vfm = useVfm()
const electionsStore = useElectionsStore()
const preferencesStore = usePreferenceStore()
const theme = computed(() => preferencesStore.theme)

const total = ref(0)
const personeriaKey = ref(0)
const contraloriaKey = ref(0)
const ombudsman = ref([])
const comptroller = ref([])

const personeriaChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Votos',
      data: [],
      backgroundColor: '#7a0c0c'
    }
  ]
})

const contraloriaChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Votos',
      data: [],
      backgroundColor: '#0c4a7a'
    }
  ]
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        title: (items) => {
          const index = items[0].dataIndex
          return items[0].dataset.fullLabels[index]
        },
        label: (ctx) => `Votos: ${ctx.parsed.y}`
      }
    }
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 0,
        minRotation: 0,
        autoSkip: false,
        color: theme.value === 'dark' ? '#111' : '#111'
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: theme.value === 'dark' ? '#111' : '#111'
      }
    }
  }
}))

watch(
  () => preferencesStore.selectedYear,
  () => {
    getResults()
  }
)

const getResults = async () => {
  if (!preferencesStore.selectedYear) return

  preferencesStore.setLoading(true)
  try {
    const response = await electionsStore.getResults(preferencesStore.selectedYear)
    if (response.status === 200) {
      total.value = response.total

      const personeria = response.candidates.filter(c => c.getType() === 'ombudsman')
      const contraloria = response.candidates.filter(c => c.getType() === 'comptroller')
      ombudsman.value = markRaw(personeria)
      comptroller.value = markRaw(contraloria)

      personeriaChartData.value = {
        labels: personeria.map((c, i) => `P${i + 1}`),
        datasets: [
          {
            label: 'Votos',
            data: personeria.map(c => c.getVotes()),
            fullLabels: personeria.map(c => c.getName()),
            backgroundColor: '#7a0c0c'
          }
        ]
      }

      contraloriaChartData.value = {
        labels: contraloria.map((c, i) => `C${i + 1}`),
        datasets: [
          {
            label: 'Votos',
            data: contraloria.map(c => c.getVotes()),
            fullLabels: contraloria.map(c => c.getName()),
            backgroundColor: '#7a0c0c'
          }
        ]
      }

      personeriaKey.value++
      contraloriaKey.value++
    } else {
      notifications.notify('No se pudieron obtener los resultados', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferencesStore.setLoading(false)
  }
}

const onOpened = async () => {
  await getResults()
}

const closeModal = () => {
  vfm.close('resultsModal')
}
</script>

<style scoped>
.charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 16px;
}

.chart-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
}

.chart-wrapper {
  position: relative;
  height: 240px;
  width: 100%;
}

.chart-card h4 {
  margin-bottom: 12px;
  color: #7a0c0c;
  text-align: center;
}

.data-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.text-result {
  font-size: 1rem;
  color: #7a0c0c;
}
</style>
