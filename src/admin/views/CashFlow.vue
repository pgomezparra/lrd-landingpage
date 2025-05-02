<template>
  <div class="consulta-container">
    <h2 class="title">Consulta Diaria</h2>

    <div class="fecha-selector">
      <label for="fecha">Fecha:</label>
      <input type="date" id="fecha" v-model="selectedDate" />
    </div>

    <div class="resumen-container">
      <div class="resumen-item ingresos">Ingresos: <span>$ {{ ingresos }}</span></div>
      <div class="resumen-item salidas">Salidas: <span>$ {{ salidas }}</span></div>
      <div class="resumen-item efectivo">Efectivo: <span>$ {{ efectivo }}</span></div>
      <div class="resumen-item transferencia">Transferencia: <span>$ {{ transferencia }}</span></div>
      <div class="resumen-item saldo">Saldo: <span>$ {{ saldo }}</span></div>
    </div>

    <h3 class="subtitulo">Movimientos del Día</h3>
    <div class="cards-container">
      <div class="movimiento-card" v-for="mov in movimientos" :key="mov.id">
        <!-- Línea 1: Fecha y valor con método -->
        <div class="card-header">
          <div class="fecha">{{ mov.fecha }}</div>
          <div class="valor-metodo">
      <span :class="mov.motivo === 'Ingreso' ? 'positivo' : 'negativo'">
        ${{ mov.valor.toLocaleString() }}
      </span>
            <span class="metodo">({{ mov.metodo }})</span>
          </div>
        </div>

        <!-- Línea 2: Descripción -->
        <div class="descripcion">
          {{ mov.concepto }}
        </div>

        <!-- Línea 3: Mes (si tiene) -->
        <div v-if="mov.mes" class="mes-destacado">
          Mes: {{ mov.mes }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedDate = ref('2025-04-11')
const ingresos = '7.524.500'
const salidas = '28.800'
const saldo = '7.495.700'
const efectivo = '5.402.500'
const transferencia = '2.030.000'

const movimientos = [
  { fecha: '2025-04-11', motivo: 'Ingreso', concepto: 'ICFES', mes: '', valor: '89.000', metodo: 'Efectivo' },
  { fecha: '2025-04-11', motivo: 'Ingreso', concepto: 'UNA CARPETA', mes: '', valor: '3.000', metodo: 'Efectivo' },
  {
    fecha: '2025-04-11',
    motivo: 'Salida',
    concepto: 'LONCHERA PROFESORES',
    mes: '',
    valor: '28.800',
    metodo: 'Efectivo'
  },
  {
    fecha: '2025-04-11',
    motivo: 'Pensión',
    concepto: 'PENSIÓN ABRIL (MIGUEL...)',
    mes: 'ABRIL',
    valor: '135.000',
    metodo: 'Efectivo'
  },
  {
    fecha: '2025-04-11',
    motivo: 'Pensión',
    concepto: 'PENSIÓN ABRIL (EMILY...)',
    mes: 'ABRIL',
    valor: '115.000',
    metodo: 'Efectivo'
  },
  {
    fecha: '2025-04-11',
    motivo: 'Pensión',
    concepto: 'ABONO TRANSFERENCIA (IHAN...)',
    mes: 'ABRIL',
    valor: '110.000',
    metodo: 'Transferencia'
  }
]
</script>

<style scoped>
.consulta-container {
  width: 50rem;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 90dvh;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.fecha-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.resumen-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  text-align: center;
  margin-bottom: 2.5rem;
}

.resumen-item {
  font-size: 1.2rem;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
}

.resumen-item span {
  display: block;
  font-size: 1.5rem;
  margin-top: 0.2rem;
}

.ingresos span,
.efectivo span {
  color: green;
}

.salidas span {
  color: red;
}

.transferencia span,
.saldo span {
  color: blue;
}

.subtitulo {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 40dvh;
  overflow-y: scroll;
}

.movimiento-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fecha {
  color: #4b5563;
  font-size: 0.9rem;
}

.valor-metodo {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.valor {
  font-weight: bold;
  font-size: 1rem;
}

.positivo {
  color: green;
}

.negativo {
  color: red;
}

.metodo {
  font-size: 0.85rem;
  color: #6b7280;
}

.descripcion {
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 500;
}

.mes-destacado {
  background-color: #f3f4f6;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
  width: fit-content;
}
</style>