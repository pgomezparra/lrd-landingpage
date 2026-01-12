<template>
  <div :class="['l-standard', { darkMode: theme === 'dark' }]">
    <div class="l-standard-title">
      <div>
        <span>Gobierno escolar</span>
      </div>
    </div>
    <div class="header-news">
      <button class="add-button" @click="addCandidate">Agregar candidato</button>
      <button class="add-button" @click="showResults">Ver resultados</button>
    </div>
    <div class="candidates-container">
      <div
        v-for="candidate in electionsStore.candidates"
        :key="candidate.getId()"
        class="news-card"
        @click="updateCandidate(candidate)"
      >
        <div class="text">
          <h3>{{ candidate.getName() }}</h3>
          <p>{{ candidate.getTypeStr() }}</p>
          <p>Número: {{ candidate.getNumberList() }}</p>
          <div class="meta">
            <small>Autor: {{ candidate.getAuthor() }}</small>
          </div>
        </div>
        <img :src="candidate.getLogo()" alt="logo" />
      </div>
    </div>

    <candidate-modal @refresh="refreshCandidates" />
    <results-modal />
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import 'element-plus/es/components/pagination/style/css'
import { useVfm } from 'vue-final-modal'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { useUserStore } from '@/admin/general/context/store/userStore.js'
import { useElectionsStore } from '@/admin/content/elections/context/store/electionsStore.js'
import CandidateModal from '@/admin/content/elections/context/components/CandidateModal.vue'
import ResultsModal from '@/admin/content/elections/context/components/ResultsModal.vue'

const electionsStore = useElectionsStore()
const preferenceStore = usePreferenceStore()
const userStore = useUserStore()
const theme = computed(() => preferenceStore.theme)

const vfm = useVfm()

watch(
  () => userStore.token,
  () => {
    searchCandidates()
  }
)
watch(
  () => preferenceStore.selectedYear,
  () => {
    searchCandidates()
  }
)
const refreshCandidates = () => {
  searchCandidates()
}

const searchCandidates = async () => {
  preferenceStore.setLoading(true)
  try {
    const success = await electionsStore.searchCandidates(preferenceStore.selectedYear)
    if (!success) {
      notifications.notify('No se pudieron cargar los candidatos', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

function addCandidate() {
  vfm.open('candidateModal')
}

function showResults() {
  vfm.open('resultsModal')
}

function updateCandidate(candidate) {
  electionsStore.setSelectedCandidate(candidate)
  vfm.open('candidateModal')
}

onMounted(async () => {
  if (!userStore.token) return
  await searchCandidates()
})
</script>
