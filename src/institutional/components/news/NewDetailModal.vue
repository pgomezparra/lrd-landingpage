<template>
  <VueFinalModal
    modal-id="newDetailModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="true"
    :esc-to-close="false"
    @closed="onClosed"
    @before-open="onBeforeOpen"
  >
    <div class="modal-content" v-if="noticia">
      <Splide
        v-if="noticia.getPhotos().length"
        :options="splideOptions"
        class="news-carousel"
      >
        <SplideSlide
          v-for="(photo, index) in noticia.getPhotos()"
          :key="index"
        >
          <img :src="photo.getUrl()" class="carousel-image" alt="Imagen de la noticia" />
        </SplideSlide>
      </Splide>
      <div class="modal-data">
        <h2 class="title-new">{{ noticia.getTitle() }}</h2>
        <p class="meta">{{ formatDate(noticia.getUpdatedAt()) }} | {{ noticia.getAuthor() }}</p>
        <div class="description-container">
          <p class="description-new">{{ noticia.getDescription() }}</p>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'
import { VueFinalModal } from 'vue-final-modal'
import { useActivityStore } from '@/admin/content/activities/context/store/activityStore.js'
import { nextTick, ref } from 'vue'

const activityStore = useActivityStore()

const noticia = ref(null)
const carouselKey = ref(0)

const splideOptions = {
  type: 'loop',
  perPage: 1,
  autoplay: true,
  interval: 5000,
  height: '300px',
  pauseOnHover: true
}

const onClosed = () => {
  activityStore.setSelectedActivity(null)
}

const onBeforeOpen = async () => {
  noticia.value = activityStore.selectedActivity
  splideOptions.type = noticia.value.getPhotos().length > 1 ? 'loop' : 'slide'
  splideOptions.arrows = noticia.value.getPhotos().length > 1
  splideOptions.pagination = noticia.value.getPhotos().length > 1
  await nextTick()
  carouselKey.value++
  window.dispatchEvent(new Event('resize'))
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('es-CO', options)
}
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
}

.news-carousel {
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
}

.carousel-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.modal-data {
  padding: 0.5rem 1rem;
}

.title-new {
  margin: 0;
  color: #610e0d;
}

.meta {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
}

.description-container {
  max-height: 10rem;
  overflow: auto;
}

.description-new {
  white-space: pre-line;
  line-height: 1.4;
  font-size: 1rem;
}
</style>