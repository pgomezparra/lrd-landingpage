<template>
  <VueFinalModal
    modal-id="newDetailModal"
    class="confirm-modal"
    content-class="public-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="true"
    :esc-to-close="false"
    @closed="onClosed"
    @before-open="onBeforeOpen"
  >
    <div class="m-new-detail-modal__content" v-if="noticia">
      <Splide
        v-if="noticia.getPhotos().length"
        :options="splideOptions"
        class="m-new-detail-modal__carousel"
      >
        <SplideSlide
          v-for="(photo, index) in noticia.getPhotos()"
          :key="index"
        >
          <img :src="photo.getUrl()" class="m-new-detail-modal__carousel-image" alt="Imagen de la noticia" />
        </SplideSlide>
      </Splide>
      <div class="m-new-detail-modal__data">
        <h2 class="m-new-detail-modal__title">{{ noticia.getTitle() }}</h2>
        <p class="m-new-detail-modal__meta">{{ formatDate(noticia.getUpdatedAt()) }} | {{ noticia.getAuthor() }}</p>
        <div class="m-new-detail-modal__description-container">
          <p class="m-new-detail-modal__description">{{ noticia.getDescription() }}</p>
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

