<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>Dashboard</p>
      <p class="l-standard-title__text">Información general de la plataforma</p>
    </div>

    <div class="dashboard-cards">
      <div class="dashboard-stat-card students-card">
        <div class="stat-header">
          <div class="stat-icon students-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span class="stat-label">Estudiantes activos</span>
        </div>
        <span class="stat-value">{{ activeStudents }}</span>
      </div>

      <div class="dashboard-stat-card income-card">
        <div class="stat-header">
          <div class="stat-icon income-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span class="stat-label">Ingresos</span>
        </div>
        <span class="stat-value positive">$ {{ totalInflow.toLocaleString('es-CO') }}</span>
      </div>

      <div class="dashboard-stat-card expense-card">
        <div class="stat-header">
          <div class="stat-icon expense-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <span class="stat-label">Gastos</span>
        </div>
        <span class="stat-value negative">$ {{ totalOutflow.toLocaleString('es-CO') }}</span>
      </div>

      <div class="dashboard-stat-card balance-card">
        <div class="stat-header">
          <div class="stat-icon balance-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
              <polyline points="17,6 23,6 23,12" />
            </svg>
          </div>
          <span class="stat-label">Balance {{ preferenceStore.selectedYear }}</span>
        </div>
        <span :class="['stat-value', 'balance', totalBalance >= 0 ? 'positive' : 'negative']">
          $ {{ totalBalance.toLocaleString('es-CO') }}
        </span>
      </div>
    </div>

    <div class="dashboard-graph-container">
      <div class="dashboard-graph">
        <Bar :key="chartKey" :data="chartData" :options="barOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { computed, onMounted, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useDashboardStore } from '@/admin/dashboard/context/store/dashboardStore.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const preferenceStore = usePreferenceStore()
const theme = computed(() => preferenceStore.theme)
const dashboardStore = useDashboardStore()

const activeStudents = ref(0)
const chartKey = ref(0)
const totalInflow = ref(0)
const totalOutflow = ref(0)
const totalBalance = ref(0)

const chartData = ref({
  labels: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  datasets: [
    {
      label: 'Ingresos',
      data: [],
      backgroundColor: '#2e7d32'
    },
    {
      label: 'Salidas',
      data: [],
      backgroundColor: '#a6192e'
    }
  ]
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed.y
          return `${context.dataset.label}: $ ${value.toLocaleString('es-CO')}`
        },
        footer: (contexts) => {
          let ingresos = 0
          let salidas = 0

          for (const ctx of contexts) {
            if (ctx.dataset.label === 'Ingresos') {
              ingresos += ctx.parsed.y
            } else if (ctx.dataset.label === 'Salidas') {
              salidas += ctx.parsed.y
            }
          }

          const saldo = ingresos - salidas

          return `Saldo: $ ${saldo.toLocaleString('es-CO')}`
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => {
          return `$ ${value.toLocaleString('es-CO')}`
        }
      }
    }
  }
}

watch(
  () => preferenceStore.selectedYear,
  (newYear) => {
    updateDashboardData()
  }
)
watch(theme, (newTheme) => {
  applyThemeToChart(newTheme)
  chartKey.value++
})
const applyThemeToChart = (mode) => {
  if (mode === 'dark') {
    chartData.value.datasets[0].backgroundColor = '#4caf50'
    chartData.value.datasets[1].backgroundColor = '#ef5350'
    barOptions.plugins.legend.labels = {
      color: '#e0e0e0'
    }
    barOptions.scales = {
      x: { ticks: { color: '#e0e0e0' }, grid: { color: '#333' } },
      y: { ticks: { color: '#e0e0e0' }, grid: { color: '#333' } }
    }
  } else {
    chartData.value.datasets[0].backgroundColor = '#2e7d32'
    chartData.value.datasets[1].backgroundColor = '#a6192e'
    barOptions.plugins.legend.labels = {
      color: '#111827'
    }
    barOptions.scales = {
      x: { ticks: { color: '#111827' }, grid: { color: '#ddd' } },
      y: { ticks: { color: '#111827' }, grid: { color: '#ddd' } }
    }
  }
}

const updateDashboardData = async () => {
  if (!preferenceStore.selectedYear) return

  try {
    const response = await dashboardStore.getData()

    if (response.success) {
      chartData.value.labels = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ]
      chartData.value.datasets[0].data = response.consolidated.getInflows()
      chartData.value.datasets[1].data = response.consolidated.getOutflows()

      activeStudents.value = response.consolidated.getStudents()
      totalInflow.value = response.consolidated.getTotalInflows()
      totalOutflow.value = response.consolidated.getTotalOutflows()
      totalBalance.value = response.consolidated.getBalance()

      chartKey.value++
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

onMounted(async () => {
  await updateDashboardData()
  applyThemeToChart(theme.value)
})

</script>
