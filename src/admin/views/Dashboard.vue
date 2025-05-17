<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>Dashboard</p>
      <p class="l-standard-title__text">Información general de la plataforma</p>
    </div>

    <div class="dashboard-cards">
      <div class="card card-total">
        <h3>Estudiantes activos</h3>
        <p class="card-number">{{ activeStudents }}</p>
      </div>
      <div class="card card-total resumen-anual">
        <h3>Resumen anual</h3>
        <div class="resumen-item-dashboard">
          <span>Ingresos:</span>
          <strong class="positivo">$ {{ totalInflow.toLocaleString('es-CO') }}</strong>
        </div>
        <div class="resumen-item-dashboard">
          <span>Salidas:</span>
          <strong class="negativo">$ {{ totalOutflow.toLocaleString('es-CO') }}</strong>
        </div>
        <div class="resumen-item-dashboard">
          <span>Saldo:</span>
          <strong :class="totalBalance >= 0 ? 'positivo' : 'negativo'">
            $ {{ totalBalance.toLocaleString('es-CO') }}
          </strong>
        </div>
      </div>
    </div>

    <div class="dashboard-graph">
      <Bar :key="chartKey" :data="chartData" :options="barOptions" />
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { onMounted, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useDashboardStore } from '@/admin/dashboard/context/store/dashboardStore.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const preferenceStore = usePreferenceStore()
const dashboardStore = useDashboardStore()

const activeStudents = ref(0)
const chartKey = ref(0)
const totalInflow = ref(0)
const totalOutflow = ref(0)
const totalBalance = ref(0)

const chartData = ref({
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
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
        label: function(context) {
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
  })

const updateDashboardData = async () => {
  if (!preferenceStore.selectedYear) return

  try {
    const response = await dashboardStore.getData()

    if (response.success) {
      chartData.value.labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
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
})
</script>

