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
    <div class="o-results-modal">
      <p class="modal-title">Resultados de la elección</p>

      <div class="modal-body">
        <div class="o-results-modal__summary">
          <div class="o-results-modal__summary-copy">
            <span class="o-results-modal__summary-label">Total de votos</span>
            <strong class="o-results-modal__summary-value">{{ total }}</strong>
          </div>
          <span class="o-results-modal__summary-meta">{{ totalCandidates }} candidatos</span>
        </div>

        <div class="o-results-modal__charts">
          <section class="o-results-modal__chart-card o-results-modal__chart-card--ombudsman">
            <header class="o-results-modal__chart-header">
              <div>
                <h4>Personería</h4>
                <p>{{ ombudsman.length }} candidatos</p>
              </div>
              <span class="o-results-modal__chart-total">{{ personeriaTotal }} votos</span>
            </header>

            <ul v-if="ombudsman.length" class="o-results-modal__results">
              <li
                v-for="candidate in ombudsman"
                :key="candidate.getId()"
                class="o-results-modal__result"
              >
                <span class="o-results-modal__result-dot" aria-hidden="true"></span>
                <span class="o-results-modal__result-name">{{ candidate.getName() }}</span>
                <strong class="o-results-modal__result-votes">{{ candidate.getVotes() }}</strong>
              </li>
            </ul>
            <p v-else class="o-results-modal__empty">Sin resultados registrados.</p>

            <div v-if="ombudsman.length" class="o-results-modal__chart-wrapper">
              <Bar
                :key="`${personeriaKey}-${theme}`"
                :data="personeriaChartData"
                :options="chartOptions"
              />
            </div>
          </section>

          <section class="o-results-modal__chart-card o-results-modal__chart-card--comptroller">
            <header class="o-results-modal__chart-header">
              <div>
                <h4>Contraloría</h4>
                <p>{{ comptroller.length }} candidatos</p>
              </div>
              <span class="o-results-modal__chart-total">{{ contraloriaTotal }} votos</span>
            </header>

            <ul v-if="comptroller.length" class="o-results-modal__results">
              <li
                v-for="candidate in comptroller"
                :key="candidate.getId()"
                class="o-results-modal__result"
              >
                <span class="o-results-modal__result-dot" aria-hidden="true"></span>
                <span class="o-results-modal__result-name">{{ candidate.getName() }}</span>
                <strong class="o-results-modal__result-votes">{{ candidate.getVotes() }}</strong>
              </li>
            </ul>
            <p v-else class="o-results-modal__empty">Sin resultados registrados.</p>

            <div v-if="comptroller.length" class="o-results-modal__chart-wrapper">
              <Bar
                :key="`${contraloriaKey}-${theme}`"
                :data="contraloriaChartData"
                :options="chartOptions"
              />
            </div>
          </section>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="button-standard button-edit" @click="closeModal">Cerrar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { computed, markRaw, ref, watch } from 'vue'
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

const chartPalette = computed(() => theme.value === 'dark'
  ? {
      ombudsman: '#c25b58',
      comptroller: '#d9b877',
      text: '#f4f0eb',
      grid: 'rgba(255, 255, 255, 0.09)',
      tooltipBackground: '#232128',
      tooltipBorder: 'rgba(255, 255, 255, 0.16)'
    }
  : {
      ombudsman: '#610e0d',
      comptroller: '#a98246',
      text: '#241e1b',
      grid: 'rgba(36, 30, 27, 0.1)',
      tooltipBackground: '#ffffff',
      tooltipBorder: 'rgba(36, 30, 27, 0.18)'
    })

const totalCandidates = computed(() => ombudsman.value.length + comptroller.value.length)
const personeriaTotal = computed(() => ombudsman.value.reduce((sum, candidate) => sum + candidate.getVotes(), 0))
const contraloriaTotal = computed(() => comptroller.value.reduce((sum, candidate) => sum + candidate.getVotes(), 0))

const buildChartData = (candidates, prefix, color) => ({
  labels: candidates.map((candidate, index) => `${prefix}${index + 1}`),
  datasets: [
    {
      label: 'Votos',
      data: candidates.map(candidate => candidate.getVotes()),
      fullLabels: candidates.map(candidate => candidate.getName()),
      backgroundColor: color,
      hoverBackgroundColor: color,
      borderRadius: 6,
      maxBarThickness: 42
    }
  ]
})

const personeriaChartData = computed(() =>
  buildChartData(ombudsman.value, 'P', chartPalette.value.ombudsman)
)

const contraloriaChartData = computed(() =>
  buildChartData(comptroller.value, 'C', chartPalette.value.comptroller)
)

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 350
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: chartPalette.value.tooltipBackground,
      borderColor: chartPalette.value.tooltipBorder,
      borderWidth: 1,
      titleColor: chartPalette.value.text,
      bodyColor: chartPalette.value.text,
      displayColors: false,
      padding: 10,
      callbacks: {
        title: (items) => items[0]?.dataset.fullLabels?.[items[0].dataIndex] ?? '',
        label: (context) => `Votos: ${context.parsed.y}`
      }
    }
  },
  scales: {
    x: {
      border: {
        color: chartPalette.value.grid
      },
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0,
        minRotation: 0,
        autoSkip: false,
        color: chartPalette.value.text,
        font: {
          size: 11,
          weight: '600'
        }
      }
    },
    y: {
      beginAtZero: true,
      border: {
        display: false
      },
      grid: {
        color: chartPalette.value.grid
      },
      ticks: {
        stepSize: 1,
        precision: 0,
        color: chartPalette.value.text,
        font: {
          size: 11
        }
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
