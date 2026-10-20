<template>
  <Navbar />
  <div class="l-news">
    <PageHeader
      eyebrow="Actualidad"
      title="Últimas noticias"
      subtitle="Conoce las actividades, logros y momentos que construyen nuestra comunidad educativa."
    />
    <main class="l-news__main">
      <div class="l-news__container">
        <div v-if="news.length" class="o-news-public__grid">
          <article v-for="activity in news" :key="activity.getId()" class="o-news-public__card">
            <div class="o-news-public__media">
              <img
                :src="activity.getPhotos()?.[0]?.getUrl()"
                :alt="activity.getTitle()"
                class="o-news-public__image"
              />
              <span class="o-news-public__date">{{ formatDate(activity.getUpdatedAt()) }}</span>
            </div>
            <div class="o-news-public__content">
              <h2 class="o-news-public__title">{{ activity.getTitle() }}</h2>
              <p class="o-news-public__meta">
                <span>{{ activity.getAuthor() }}</span>
              </p>
              <div class="o-news-public__read-more-container">
                <button class="o-news-public__read-more" @click="seeNewDetail(activity)">
                  Ver detalle
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="l-news__empty">Aún no hay noticias publicadas. Vuelve pronto.</p>

        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="perPage"
          :current-page="page"
          hide-on-single-page
          @update:current-page="handlePageChange"
          class="o-news-public__pagination"
        />
      </div>
    </main>
    <Footer />
  </div>
  <whatsapp />
  <new-detail-modal />
</template>

<script setup>
import Navbar from '@/navbar/components/NavBar.vue'
import Footer from '@/general/components/Footer.vue'
import PageHeader from '@/general/components/PageHeader.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'
import { ref, onMounted, markRaw } from 'vue'
import { ElPagination } from 'element-plus'
import 'element-plus/es/components/pagination/style/css'
import { NEWS_PER_PAGE } from '@/shared/constants.js'
import { useActivityStore } from '@/admin/content/activities/context/store/activityStore.js'
import NewDetailModal from '@/institutional/components/news/NewDetailModal.vue'
import { useVfm } from 'vue-final-modal'

const activityStore = useActivityStore()
const vfm = useVfm()

const news = ref([])
const page = ref(1)
const total = ref(1)

const perPage = NEWS_PER_PAGE

const handlePageChange = (newValue) => {
  page.value = newValue
  getNews()
}

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const seeNewDetail = (activity) => {
  activityStore.setSelectedActivity(activity)
  vfm.open('newDetailModal')
}

const getNews = async () => {
  try {
    const response = await activityStore.getPublicActivities(page.value)
    if (response.status === 200) {
      news.value = response.activities.map((activity) => markRaw(activity))
      total.value = response.total
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

onMounted(async () => getNews())
</script>
