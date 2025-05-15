<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>PQRS</p>
      <p class="l-standard-title__text">Gestión de los pqrs <span class="badge">{{ pqrs.length }}</span></p>
    </div>
    <div>
      <div v-for="pqr in pqrs" :key="pqr.id" class="pqr-card">
        <div class="pqr-info">
          <div class="pqr-user">{{ pqr.usuario }}</div>
          <div class="pqr-contenido">{{ pqr.contenido }}</div>
          <div class="pqr-footer">
            <span class="pqr-fecha">{{ pqr.fecha }}</span>
            <span class="pqr-estado" :class="pqr.estado === 'Cerrado' ? 'cerrado' : 'pendiente'">
            {{ pqr.estado }}
          </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const pqrs = [
  {
    id: 1,
    usuario: 'María Torres',
    contenido: 'Quisiera saber por qué no se reflejan mis pagos en el sistema desde el mes pasado. Además...',
    fecha: '10 mayo 2025',
    estado: 'Sin responder'
  },
  {
    id: 2,
    usuario: 'Carlos Ruiz',
    contenido: 'Gracias por la atención, ya quedó solucionado mi inconveniente con el recibo.',
    fecha: '08 mayo 2025',
    estado: 'Cerrado'
  }
]
</script>

<style scoped>
.badge {
  background-color: #5b1210;
  color: white;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.9rem;
}

.pqr-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 1rem;
  padding: 1rem;
}

.pqr-user {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.pqr-contenido {
  color: #444;
  max-height: 3.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* número de líneas antes de truncar */
  -webkit-box-orient: vertical;
  margin-bottom: 0.5rem;
}

.pqr-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
}

.pqr-estado {
  font-weight: bold;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
}

.pqr-estado.pendiente {
  background-color: #f9d3d3;
  color: #b30000;
}

.pqr-estado.cerrado {
  background-color: #d3f9da;
  color: #2a7c35;
}
</style>
