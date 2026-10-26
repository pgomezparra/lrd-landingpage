<template>
  <div class="l-standard l-standard--fill dashboard-view">
    <header class="dashboard-heading">
      <div>
        <p class="dashboard-heading__title">Dashboard</p>
        <p class="dashboard-heading__text">Información general de la plataforma</p>
      </div>
      <span class="dashboard-heading__period">Año {{ preferenceStore.selectedYear }}</span>
    </header>

    <section class="dashboard-cards" aria-label="Indicadores principales">
      <article class="dashboard-stat-card dashboard-stat-card--students">
        <div class="dashboard-stat-card__head">
          <span class="stat-label">Estudiantes activos</span>
          <span class="stat-icon students-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
        </div>
        <strong class="stat-value">{{ activeStudents.toLocaleString('es-CO') }}</strong>
        <span class="stat-meta">Matrícula vigente en {{ preferenceStore.selectedYear }}</span>
      </article>

      <article class="dashboard-stat-card dashboard-stat-card--income">
        <div class="dashboard-stat-card__head">
          <span class="stat-label">Ingresos del año</span>
          <span class="stat-icon income-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
        </div>
        <strong class="stat-value positive">{{ formatCurrency(totalInflow) }}</strong>
        <span class="stat-meta">Promedio mensual {{ formatCurrency(monthlyAverageInflow) }}</span>
      </article>

      <article class="dashboard-stat-card dashboard-stat-card--expense">
        <div class="dashboard-stat-card__head">
          <span class="stat-label">Egresos del año</span>
          <span class="stat-icon expense-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </span>
        </div>
        <strong class="stat-value negative">{{ formatCurrency(totalOutflow) }}</strong>
        <span class="stat-meta">Promedio mensual {{ formatCurrency(monthlyAverageOutflow) }}</span>
      </article>

      <article class="dashboard-stat-card dashboard-stat-card--balance">
        <div class="dashboard-stat-card__head">
          <span class="stat-label">Balance {{ preferenceStore.selectedYear }}</span>
          <span class="stat-icon balance-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
              <polyline points="17,6 23,6 23,12" />
            </svg>
          </span>
        </div>
        <strong :class="['stat-value', totalBalance >= 0 ? 'positive' : 'negative']">
          {{ formatCurrency(totalBalance) }}
        </strong>
        <span :class="['stat-meta', totalBalance >= 0 ? 'positive' : 'negative']">{{ balanceMeta }}</span>
      </article>
    </section>

    <div class="dashboard-grid dashboard-grid--primary">
      <section class="dashboard-panel dashboard-panel--flow">
        <header class="dashboard-panel__header">
          <div>
            <span class="dashboard-panel__eyebrow">Flujo de caja</span>
            <h2 class="dashboard-panel__title">Ingresos y egresos por mes</h2>
            <p class="dashboard-panel__subtitle">Comparativo mensual de los movimientos registrados.</p>
          </div>
          <span class="dashboard-panel__badge">{{ preferenceStore.selectedYear }}</span>
        </header>
        <div class="dashboard-chart dashboard-chart--bar" role="img" aria-label="Gráfica de ingresos y egresos por mes">
          <Bar :key="chartKey" :data="chartData" :options="barOptions" />
        </div>
      </section>

      <aside class="dashboard-panel dashboard-panel--insights">
        <header class="dashboard-panel__header">
          <div>
            <span class="dashboard-panel__eyebrow">Radiografía del año</span>
            <h2 class="dashboard-panel__title">Indicadores clave</h2>
            <p class="dashboard-panel__subtitle">Lectura rápida del comportamiento financiero.</p>
          </div>
        </header>

        <div class="dashboard-insights">
          <div class="dashboard-insight-row">
            <span class="dashboard-insight-row__label">Promedio de ingresos</span>
            <strong class="dashboard-insight-row__value positive">{{ formatCurrency(monthlyAverageInflow) }}</strong>
          </div>
          <div class="dashboard-insight-row">
            <span class="dashboard-insight-row__label">Promedio de egresos</span>
            <strong class="dashboard-insight-row__value negative">{{ formatCurrency(monthlyAverageOutflow) }}</strong>
          </div>
          <div class="dashboard-insight-row">
            <span class="dashboard-insight-row__label">Mejor mes</span>
            <span class="dashboard-insight-row__stack">
              <strong class="dashboard-insight-row__value">{{ bestMonth.name }}</strong>
              <small>{{ formatCurrency(bestMonth.net) }} netos</small>
            </span>
          </div>
        </div>

        <div class="dashboard-savings">
          <div class="dashboard-savings__head">
            <span>Margen de ahorro</span>
            <strong :class="{ negative: savingsRate < 0 }">{{ savingsDisplay }}</strong>
          </div>
          <div
            class="dashboard-savings__track"
            role="progressbar"
            :aria-valuenow="savingsProgress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span
              :class="['dashboard-savings__bar', { 'dashboard-savings__bar--negative': savingsRate < 0 }]"
              :style="{ width: `${savingsProgress}%` }"
            ></span>
          </div>
          <p>{{ savingsCaption }}</p>
        </div>

        <p class="dashboard-insight-note">{{ insightMessage }}</p>
      </aside>
    </div>

    <div class="dashboard-grid dashboard-grid--secondary">
      <section class="dashboard-panel dashboard-panel--balance">
        <header class="dashboard-panel__header">
          <div>
            <span class="dashboard-panel__eyebrow">Tendencia</span>
            <h2 class="dashboard-panel__title">Saldo acumulado</h2>
            <p class="dashboard-panel__subtitle">Evolución del balance a lo largo del año.</p>
          </div>
        </header>
        <div class="dashboard-chart dashboard-chart--line" role="img" aria-label="Gráfica del saldo acumulado por mes">
          <Line :key="chartKey" :data="balanceChartData" :options="lineOptions" />
        </div>
      </section>

      <section class="dashboard-panel dashboard-panel--distribution">
        <header class="dashboard-panel__header">
          <div>
            <span class="dashboard-panel__eyebrow">Composición</span>
            <h2 class="dashboard-panel__title">Ingresos vs. egresos</h2>
            <p class="dashboard-panel__subtitle">Participación de cada flujo en el total del año.</p>
          </div>
        </header>
        <div class="dashboard-chart dashboard-chart--donut" role="img" aria-label="Distribución de ingresos y egresos">
          <Doughnut :key="chartKey" :data="flowDistributionData" :options="doughnutOptions" />
          <div class="dashboard-donut__center">
            <span>Margen</span>
            <strong :class="{ negative: savingsRate < 0 }">{{ savingsDisplay }}</strong>
          </div>
        </div>
        <div class="dashboard-donut-legend">
          <div class="dashboard-donut-legend__row">
            <span class="dashboard-donut-legend__label">
              <i class="dashboard-donut-legend__dot dashboard-donut-legend__dot--income"></i>
              Ingresos
            </span>
            <strong>{{ formatCurrency(totalInflow) }}</strong>
          </div>
          <div class="dashboard-donut-legend__row">
            <span class="dashboard-donut-legend__label">
              <i class="dashboard-donut-legend__dot dashboard-donut-legend__dot--expense"></i>
              Egresos
            </span>
            <strong>{{ formatCurrency(totalOutflow) }}</strong>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import { computed, onMounted, ref, watch } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useDashboardStore } from '@/admin/dashboard/context/store/dashboardStore.js'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
)

const preferenceStore = usePreferenceStore()
const dashboardStore = useDashboardStore()

const theme = computed(() => preferenceStore.theme)
const activeStudents = ref(0)
const chartKey = ref(0)
const totalInflow = ref(0)
const totalOutflow = ref(0)
const totalBalance = ref(0)
const inflowSeries = ref([])
const outflowSeries = ref([])

const monthLabels = [
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

const chartPalette = computed(() => {
  const isDark = theme.value === 'dark'

  return isDark
    ? {
        inflow: '#4ade80',
        inflowHover: '#86efac',
        outflow: '#f87171',
        outflowHover: '#fca5a5',
        balance: '#d9b877',
        balanceFill: 'rgba(217, 184, 119, 0.16)',
        balancePoint: '#f0d49a',
        grid: 'rgba(255, 255, 255, 0.08)',
        text: '#a99f9a',
        tooltipBackground: '#2a272f',
        tooltipTitle: '#ffffff',
        tooltipText: '#f4f0eb',
        tooltipBorder: 'rgba(255, 255, 255, 0.16)'
      }
    : {
        inflow: '#15803d',
        inflowHover: '#22a34f',
        outflow: '#b42318',
        outflowHover: '#dc3a2c',
        balance: '#610e0d',
        balanceFill: 'rgba(97, 14, 13, 0.1)',
        balancePoint: '#8a2422',
        grid: 'rgba(36, 30, 27, 0.08)',
        text: '#7c6f68',
        tooltipBackground: '#241e1b',
        tooltipTitle: '#ffffff',
        tooltipText: '#faf8f4',
        tooltipBorder: 'rgba(36, 30, 27, 0.12)'
      }
})

const formatCurrency = (value) => `$\u00A0${(Number(value) || 0).toLocaleString('es-CO')}`

const formatCompactCurrency = (value) => {
  const number = Number(value) || 0
  const absolute = Math.abs(number)

  if (absolute >= 1000000) {
    return `$\u00A0${(number / 1000000).toLocaleString('es-CO', { maximumFractionDigits: 1 })}M`
  }

  if (absolute >= 1000) {
    return `$\u00A0${(number / 1000).toLocaleString('es-CO', { maximumFractionDigits: 0 })}k`
  }

  return formatCurrency(number)
}

const formatPercent = (value) =>
  `${(Number(value) || 0).toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`

const monthlyAverageInflow = computed(() => Math.round(totalInflow.value / 12))
const monthlyAverageOutflow = computed(() => Math.round(totalOutflow.value / 12))
const hasData = computed(
  () =>
    inflowSeries.value.some((value) => Number(value) > 0) ||
    outflowSeries.value.some((value) => Number(value) > 0)
)

const savingsRate = computed(() =>
  totalInflow.value > 0 ? (totalBalance.value / totalInflow.value) * 100 : 0
)

const savingsProgress = computed(() => Math.min(100, Math.max(0, savingsRate.value)))
const savingsDisplay = computed(() => (hasData.value ? formatPercent(savingsRate.value) : '—'))

const bestMonth = computed(() => {
  if (!hasData.value) return { name: 'Sin movimientos', net: 0 }

  return monthLabels.reduce(
    (best, name, index) => {
      const net =
        Number(inflowSeries.value[index] || 0) - Number(outflowSeries.value[index] || 0)
      return net > best.net ? { name, net } : best
    },
    { name: '—', net: Number.NEGATIVE_INFINITY }
  )
})

const balanceMeta = computed(() => {
  if (!hasData.value) return 'Sin movimientos registrados'

  return totalBalance.value >= 0
    ? `Margen de ahorro de ${formatPercent(savingsRate.value)}`
    : `Déficit de ${formatPercent(Math.abs(savingsRate.value))} sobre ingresos`
})

const savingsCaption = computed(() => {
  if (!hasData.value) return 'Sin ingresos registrados para calcular el margen.'

  return totalBalance.value >= 0
    ? 'Porcentaje del ingreso anual que se conserva como balance.'
    : 'Los egresos superan los ingresos registrados en el periodo.'
})

const insightMessage = computed(() => {
  if (!hasData.value) {
    return `Aún no hay movimientos registrados para ${preferenceStore.selectedYear}.`
  }

  const concept = totalBalance.value >= 0 ? 'superávit' : 'déficit'
  return `El año cierra con un ${concept} de ${formatCurrency(Math.abs(totalBalance.value))}. ${bestMonth.value.name} registra el mejor resultado mensual.`
})

const cumulativeBalance = computed(() => {
  let runningBalance = 0

  return monthLabels.map((_, index) => {
    runningBalance +=
      Number(inflowSeries.value[index] || 0) - Number(outflowSeries.value[index] || 0)
    return runningBalance
  })
})

const chartData = computed(() => {
  const palette = chartPalette.value

  return {
    labels: monthLabels,
    datasets: [
      {
        label: 'Ingresos',
        data: inflowSeries.value,
        backgroundColor: palette.inflow,
        hoverBackgroundColor: palette.inflowHover,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24
      },
      {
        label: 'Egresos',
        data: outflowSeries.value,
        backgroundColor: palette.outflow,
        hoverBackgroundColor: palette.outflowHover,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24
      }
    ]
  }
})

const barOptions = computed(() => {
  const palette = chartPalette.value

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: palette.text,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
          font: {
            size: 11,
            weight: 600
          }
        }
      },
      tooltip: {
        backgroundColor: palette.tooltipBackground,
        titleColor: palette.tooltipTitle,
        bodyColor: palette.tooltipText,
        borderColor: palette.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
          footer: (contexts) => {
            const inflow =
              Number(contexts.find((context) => context.dataset.label === 'Ingresos')?.parsed.y) || 0
            const outflow =
              Number(contexts.find((context) => context.dataset.label === 'Egresos')?.parsed.y) || 0
            return `Saldo: ${formatCurrency(inflow - outflow)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: palette.text,
          maxRotation: 0,
          autoSkip: true,
          autoSkipPadding: 8,
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: palette.grid,
          drawTicks: false
        },
        border: {
          display: false
        },
        ticks: {
          color: palette.text,
          padding: 8,
          font: {
            size: 11
          },
          callback: formatCompactCurrency
        }
      }
    }
  }
})

const balanceChartData = computed(() => {
  const palette = chartPalette.value

  return {
    labels: monthLabels,
    datasets: [
      {
        label: 'Saldo acumulado',
        data: cumulativeBalance.value,
        backgroundColor: palette.balanceFill,
        borderColor: palette.balance,
        pointBackgroundColor: palette.balancePoint,
        pointBorderColor: palette.balancePoint,
        fill: true,
        tension: 0.38,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 16
      }
    ]
  }
})

const lineOptions = computed(() => {
  const palette = chartPalette.value

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: palette.tooltipBackground,
        titleColor: palette.tooltipTitle,
        bodyColor: palette.tooltipText,
        borderColor: palette.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        callbacks: {
          label: (context) => `Saldo acumulado: ${formatCurrency(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: palette.text,
          maxRotation: 0,
          autoSkip: true,
          autoSkipPadding: 8,
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: palette.grid,
          drawTicks: false
        },
        border: {
          display: false
        },
        ticks: {
          color: palette.text,
          padding: 8,
          font: {
            size: 11
          },
          callback: formatCompactCurrency
        }
      }
    }
  }
})

const flowDistributionData = computed(() => {
  const palette = chartPalette.value

  return {
    labels: ['Ingresos', 'Egresos'],
    datasets: [
      {
        data: [totalInflow.value, totalOutflow.value],
        backgroundColor: [palette.inflow, palette.outflow],
        hoverBackgroundColor: [palette.inflowHover, palette.outflowHover],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  }
})

const doughnutOptions = computed(() => {
  const palette = chartPalette.value

  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: palette.tooltipBackground,
        titleColor: palette.tooltipTitle,
        bodyColor: palette.tooltipText,
        borderColor: palette.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        callbacks: {
          label: (context) => `${context.label}: ${formatCurrency(context.parsed)}`
        }
      }
    }
  }
})

const normalizeSeries = (series) =>
  monthLabels.map((_, index) => Number(series?.[index] || 0))

watch(
  () => preferenceStore.selectedYear,
  () => {
    updateDashboardData()
  }
)

watch(theme, () => {
  chartKey.value++
})

const updateDashboardData = async () => {
  if (!preferenceStore.selectedYear) return

  try {
    const response = await dashboardStore.getData()
    if (!response?.success) return

    const consolidated = response.consolidated

    inflowSeries.value = normalizeSeries(consolidated.getInflows())
    outflowSeries.value = normalizeSeries(consolidated.getOutflows())
    activeStudents.value = consolidated.getStudents()
    totalInflow.value = consolidated.getTotalInflows()
    totalOutflow.value = consolidated.getTotalOutflows()
    totalBalance.value = consolidated.getBalance()

    chartKey.value++
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

onMounted(async () => {
  await updateDashboardData()
})
</script>
