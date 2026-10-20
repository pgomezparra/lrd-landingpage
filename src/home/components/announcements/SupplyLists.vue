<template>
  <Navbar />
  <div class="l-supply-lists">
    <PageHeader
      eyebrow="Año escolar"
      :title="`Listas de útiles ${year}`"
      subtitle="Selecciona el nivel educativo para consultar y descargar la lista de útiles correspondiente."
    />
    <main class="l-supply-lists__main">
      <section class="l-supply-lists__columns">
        <a
          v-for="supply in supplies"
          :key="supply.title"
          :href="supply.url"
          target="_blank"
          rel="noopener noreferrer"
          class="l-supply-lists__card"
        >
          <div class="l-supply-lists__imgwrap">
            <img :src="supply.image" :alt="`Lista de útiles de ${supply.title}`" />
          </div>
          <div class="l-supply-lists__caption">
            <span class="l-supply-lists__level">{{ supply.title }}</span>
            <span class="l-supply-lists__action">
              Ver lista
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </a>
      </section>
    </main>
    <Footer />
  </div>
  <whatsapp />
</template>

<script setup>
import Footer from '@/general/components/Footer.vue'
import Navbar from '@/navbar/components/NavBar.vue'
import PageHeader from '@/general/components/PageHeader.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'
import Prejardin from '@/assets/img/home/supply-lists/prejardin.webp'
import Jardin from '@/assets/img/home/supply-lists/jardin.webp'
import Transicion from '@/assets/img/home/supply-lists/transicion.webp'
import Primaria from '@/assets/img/home/supply-lists/primaria.webp'
import Bachillerato from '@/assets/img/home/supply-lists/bachillerato.webp'

const year = new Date().getFullYear()

const supplies = [
  {
    title: 'Pre-Jardín',
    image: Prejardin,
    url: 'https://drive.google.com/file/d/1nXiO0JLKQKEIHzssTbxfj0kcdZ5ClNbV/view?usp=sharing'
  },
  {
    title: 'Jardín',
    image: Jardin,
    url: 'https://drive.google.com/file/d/14rOBS41GYj-JqnO9c6AC1Yghw6ZoY2J6/view?usp=sharing'
  },
  {
    title: 'Transición',
    image: Transicion,
    url: 'https://drive.google.com/file/d/1bt2iW7nZLZA-cXgElB8oKC1vg2b7N0ss/view?usp=sharing'
  },
  {
    title: 'Primaria',
    image: Primaria,
    url: 'https://drive.google.com/file/d/1U5oPuH4_9zqKkgTnav0hv-vrgeYLSVYh/view?usp=sharing'
  },
  {
    title: 'Bachillerato',
    image: Bachillerato,
    url: 'https://drive.google.com/file/d/1nCHMz20JZWUl1dqAPTxzxUmqNJtPn7iT/view?usp=sharing'
  }
]
</script>
