<template>
  <Navbar />
  <div class="l-institutional">
    <p class="l-institutional__container__title">Documentos Institucionales</p>
    <main>
      <div class="l-institutional__container">
        <div class="l-institutional__container__tabs">
          <button
            v-for="(pdf, index) in pdfs"
            :key="index"
            @click="selectedPdf = pdf.url"
            :class="['l-institutional__container__tabs__tab', { 'l-institutional__container__tabs__tab--active': selectedPdf === pdf.url }]"
          >
            {{ pdf.title }}
          </button>
        </div>
        <section class="l-institutional__container__section">
          <iframe
            src="https://drive.google.com/file/d/18R8svTACgVbP3UfB8TbA95CPDXgOKjhI/preview"
            width="100%"
          ></iframe>
        </section>
      </div>
    </main>
    <Footer />
  </div>
  <whatsapp />
</template>

<script setup>
import Footer from '@/general/components/Footer.vue'
import { ref } from 'vue'
import Navbar from '@/navbar/components/NavBar.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'

const pdfs = ref([
  { title: 'Cronograma Escolar', url: 'https://drive.google.com/file/d/18R8svTACgVbP3UfB8TbA95CPDXgOKjhI/preview' }
  // { title: 'Reglamento', url: 'https://drive.google.com/file/d/1B2C3D4E5F6G7H8I9J0K/preview' },
  // { title: 'Lista de Útiles', url: 'https://drive.google.com/file/d/2A3B4C5D6E7F8G9H0I1J/preview' }
])

const selectedPdf = ref(pdfs.value[0].url)
</script>
