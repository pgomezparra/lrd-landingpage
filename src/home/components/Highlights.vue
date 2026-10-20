<template>
  <section class="o-highlights">
    <div class="o-highlights__inner">
      <div class="o-highlights__intro">
        <span class="o-highlights__eyebrow">Nuestro sello</span>
        <h2 class="o-highlights__title">Una formación integral, cercana y con propósito</h2>
        <p class="o-highlights__text">
          Acompañamos a cada estudiante en su crecimiento académico, personal y espiritual, en un
          entorno que promueve el respeto, la responsabilidad y el servicio.
        </p>
      </div>

      <div class="o-highlights__grid">
        <article v-for="item in items" :key="item.title" class="o-highlights__card">
          <span class="o-highlights__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path :d="item.icon" />
            </svg>
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    title: 'Principios y valores',
    description:
      'Una formación cristiana que fortalece el carácter, la empatía y la toma de decisiones.',
    icon: 'M12 3 4 7v5c0 4.4 3.4 7.8 8 9 4.6-1.2 8-4.6 8-9V7l-8-4Z M9 12l2 2 4-4'
  },
  {
    title: 'Acompañamiento cercano',
    description:
      'Docentes y familias trabajan de la mano para acompañar el proceso de cada estudiante.',
    icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8'
  },
  {
    title: 'Proyección académica',
    description:
      'Bases sólidas desde preescolar hasta bachillerato para asumir los retos del futuro.',
    icon: 'M22 10 12 5 2 10l10 5 10-5Z M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5'
  }
]
</script>
