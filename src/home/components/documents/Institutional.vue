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
            @click="changePdf(pdf.url)"
            :class="['l-institutional__container__tabs__tab', { 'l-institutional__container__tabs__tab--active': selectedPdf === pdf.url }]"
          >
            {{ pdf.title }}
          </button>
        </div>
        <section class="l-institutional__container__section">
          <iframe
            :src="selectedPdf"
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
  {
    title: 'Cronograma Escolar',
    url: '/pdfs/Cronograma.pdf'
  },
  { title: 'Resolución', url: '/pdfs/Resolucion.pdf' }
])

const changePdf = (url) => {
  selectedPdf.value = url
}

const selectedPdf = ref(pdfs.value[0].url)
</script>
