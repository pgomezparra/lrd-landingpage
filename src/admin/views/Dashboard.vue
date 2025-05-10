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

<style scoped>
.l-standard {
  padding: 2rem;
}

.l-standard-title {
  margin-bottom: 2rem;
}

.l-standard-title p:first-child {
  font-size: 1.5rem;
  font-weight: bold;
}

.l-standard-title__text {
  color: #6b7280;
  font-size: 1rem;
}

.dashboard-cards {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.resumen-anual {
  min-width: 280px;
}

.resumen-item-dashboard {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.positivo {
  color: #4caf50;
}

.negativo {
  color: #f44336;
}

.card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #374151;
}

.card-number {
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
}

.dashboard-graph {
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
