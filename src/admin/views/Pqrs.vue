<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>PQRS</p>
      <p class="l-standard-title__text">Gestión de los pqrs <span class="o-pqrs__badge">{{ pqrs.length }}</span></p>
    </div>
    <div>
      <div v-for="pqr in pqrs" :key="pqr.id" class="o-pqrs__card">
        <div class="o-pqrs__info">
          <div class="o-pqrs__user">{{ pqr.usuario }}</div>
          <div class="o-pqrs__contenido">{{ pqr.contenido }}</div>
          <div class="o-pqrs__footer">
            <span class="o-pqrs__fecha">{{ pqr.fecha }}</span>
            <span class="o-pqrs__estado" :class="pqr.estado === 'Cerrado' ? 'cerrado' : 'pendiente'">
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


