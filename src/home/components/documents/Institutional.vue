<template>
  <Navbar />
  <div class="l-institutional">
    <PageHeader
      eyebrow="Transparencia"
      title="Documentos institucionales"
      subtitle="Consulta los documentos y resoluciones que orientan el funcionamiento de nuestra institución."
    />
    <main class="l-institutional__main">
      <div class="l-institutional__container">
        <div class="l-institutional__container__tabs">
          <button
            v-for="pdf in pdfs"
            :key="pdf.url"
            type="button"
            @click="changePdf(pdf)"
            :class="[
              'l-institutional__container__tabs__tab',
              { 'l-institutional__container__tabs__tab--active': selectedPdf === pdf.url }
            ]"
          >
            {{ pdf.title }}
          </button>
        </div>

        <section class="l-institutional__container__section">
          <header class="l-institutional__frame-head">
            <span class="l-institutional__frame-dot"></span>
            {{ selectedTitle }}
          </header>
          <iframe :src="selectedPdf" :title="selectedTitle" width="100%"></iframe>
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
import PageHeader from '@/general/components/PageHeader.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'

const pdfs = ref([
  {
    title: 'Cronograma Escolar',
    url: '/pdfs/Cronograma.pdf'
  },
  { title: 'Resolución', url: '/pdfs/Resolucion.pdf' }
])

const selectedPdf = ref(pdfs.value[0].url)
const selectedTitle = ref(pdfs.value[0].title)

const changePdf = (pdf) => {
  selectedPdf.value = pdf.url
  selectedTitle.value = pdf.title
}
</script>
