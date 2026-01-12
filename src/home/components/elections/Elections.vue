<template>
  <loading-overlay />
  <NavBar />
  <div class="container">
    <div v-if="step === 1" class="card">
      <h2>Ingreso a votación</h2>
      <p class="subtitle">
        Ingrese su documento de identificación
      </p>

      <input
        v-model="document"
        type="text"
        inputmode="numeric"
        placeholder="Número de documento"
        class="input"
        ref="documentInput"
        :disabled="!activeElections"
        @keyup.enter="goToVoting"
      />

      <button
        class="primary-btn"
        :disabled="!document"
        @click="goToVoting"
      >
        Continuar
      </button>
    </div>

    <div v-else class="card">
      <h2>Tarjetón electoral</h2>
      <p class="subtitle">
        Seleccione un candidato por cada categoría
      </p>

      <div class="grid">
        <!-- CONTRALORÍA -->
        <div class="category">
          <h3>Contraloría</h3>

          <label
            v-for="candidate in comptrollerCandidates"
            :key="candidate.getId()"
            class="option"
          >
            <input
              type="radio"
              name="comptroller"
              :value="candidate.getId()"
              v-model="vote.comptroller"
            />

            <template class="candidate">
              <img
                :src="candidate.getLogo()"
                :alt="candidate.getName()"
                class="candidate-logo"
              />

              <span class="candidate-name">
                {{ candidate.getName() }}
              </span>
              <p v-if="!candidate.getName().includes('blanco')" class="candidate-number">
                {{ candidate.getNumberList() }}
              </p>
            </template>
          </label>
        </div>

        <!-- PERSONERÍA -->
        <div class="category">
          <h3>Personería</h3>

          <label
            v-for="candidate in ombudsmanCandidates"
            :key="candidate.getId()"
            class="option"
          >
            <input
              type="radio"
              name="ombudsman"
              :value="candidate.getId()"
              v-model="vote.ombudsman"
            />

            <template class="candidate">
              <img
                :src="candidate.getLogo()"
                :alt="candidate.getName()"
                class="candidate-logo"
              />

              <span class="candidate-name">
                {{ candidate.getName() }}
              </span>
              <p v-if="!candidate.getName().includes('blanco')" class="candidate-number">
                {{ candidate.getNumberList() }}
              </p>
            </template>
          </label>
        </div>
      </div>

      <button
        class="primary-btn"
        :disabled="!canVote"
        @click="submitVote"
      >
        Votar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import NavBar from '@/navbar/components/NavBar.vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { useElectionsStore } from '@/admin/content/elections/context/store/electionsStore.js'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'
import LoadingOverlay from '@/admin/views/LoadingOverlay.vue'

const preferenceStore = usePreferenceStore()
const studentsStore = useStudentStore()
const electionsStore = useElectionsStore()

const activeElections = ref(false)
const documentInput = ref(null)

const step = ref(1)
const document = ref('')
const studentId = ref(0)

const vote = ref({
  comptroller: null,
  ombudsman: null
})

watch(
  () => preferenceStore.publicPreferences,
  () => {
    if (!preferenceStore.publicPreferences.getActiveElections()) {
      notifications.notify('Las elecciones no están activas', 'error')
      return
    }
    activeElections.value = true
  }
)

const comptrollerCandidates = computed(() => {
  return electionsStore.candidates.filter(candidate => candidate.getType() === 'comptroller')
})

const ombudsmanCandidates = computed(() => {
  return electionsStore.candidates.filter(candidate => candidate.getType() === 'ombudsman')
})

const canVote = computed(() => {
  return vote.value.comptroller && vote.value.ombudsman
})

const goToVoting = async () => {
  if (!activeElections.value) return

  preferenceStore.setLoading(true)
  let response = null
  try {
    response = await studentsStore.searchByDocumentAndYear(document.value)
    if (response.status !== 200) {
      notifications.notify('Error al buscar el documento', 'error')
      return
    }
    if (response.students.length === 0) {
      notifications.notify('No existe este documento', 'error')
      return
    }
    if (!response.students[0].isActive()) {
      notifications.notify('Este documento no está activo', 'error')
      return
    }
  } catch (error) {
    console.error(`error: ${error}`)
    notifications.notify('Error al buscar el documento', 'error')
  } finally {
    preferenceStore.setLoading(false)
  }

  preferenceStore.setLoading(true)
  try {
    const responseVote = await electionsStore.validateVote(response.students[0].getId(), new Date().getFullYear())
    if (responseVote.status !== 200) {
      notifications.notify('Error al validar el voto', 'error')
      return
    }
    if (responseVote.votes.length > 0) {
      notifications.notify('El estudiante ya ha votado', 'error')
      return
    }

  } catch (error) {
    console.error(`error: ${error}`)
    notifications.notify('Error al validar el voto', 'error')
  } finally {
    preferenceStore.setLoading(false)
  }

  preferenceStore.setLoading(true)
  try {
    const success = await electionsStore.searchCandidates(new Date().getFullYear())
    if (success) {
      step.value = 2
      studentId.value = response.students[0].getId()
    } else {
      notifications.notify('Error al buscar los candidatos', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
    notifications.notify('Error al buscar los candidatos', 'error')
  } finally {
    preferenceStore.setLoading(false)
  }
}

const submitVote = async () => {
  if (!canVote.value) return

  preferenceStore.setLoading(true)
  try {
    const data = {
      year: new Date().getFullYear(),
      studentId: studentId.value,
      comptroller: vote.value.comptroller,
      ombudsman: vote.value.ombudsman
    }
    const response = await electionsStore.saveVote(data)
    if (response.status !== 201) {
      notifications.notify('Error al registrar el voto', 'error')
    } else {
      notifications.notify('Voto registrado correctamente', 'success')
      step.value = 1
      document.value = ''
      studentId.value = 0
      vote.value = {
        comptroller: null,
        ombudsman: null
      }
      await nextTick(() => {
        documentInput.value?.focus()
      })
    }
  } catch (error) {
    console.error(`error: ${error}`)
    notifications.notify('Error al registrar el voto', 'error')
  } finally {
    preferenceStore.setLoading(false)
  }
}

onMounted(() => {
  if (!preferenceStore.publicPreferences) return

  if (!preferenceStore.publicPreferences.getActiveElections()) {
    notifications.notify('Las elecciones no están activas', 'error')
    return
  }
  activeElections.value = true
  nextTick(() => {
    documentInput.value?.focus()
  })
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 16px;
  font-family: system-ui, sans-serif;
  height: 90dvh;
  overflow-y: scroll;
}

.card {
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  padding: 20px;
}

h2 {
  color: #7a0c0c;
  margin-bottom: 6px;
  font-size: clamp(20px, 4vw, 26px);
}

.subtitle {
  color: #555;
  margin-bottom: 20px;
  font-size: clamp(14px, 3vw, 16px);
}

.input {
  width: 90%;
  padding: 14px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  gap: 20px;
}

.category h3 {
  color: #7a0c0c;
  margin-bottom: 12px;
  font-size: 18px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.candidate {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.option:hover {
  background: #faf5f5;
  border-color: #7a0c0c;
}

.option input {
  width: 18px;
  height: 18px;
}

.primary-btn {
  width: 100%;
  margin-top: 16px;
  background: #7a0c0c;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 17px;
  cursor: pointer;
}

.primary-btn:disabled {
  background: #c9a5a5;
  cursor: not-allowed;
}

.candidate-logo {
  width: 6rem;
  height: 6rem;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
  padding: 4px;
  border: 1px solid #eee;
}

.candidate-name {
  width: 8rem;
  flex: 1;
  font-size: 15px;
  text-align: center;
  overflow-wrap: break-word;
  word-break: break-word;
}

.candidate-number {
  font-size: 2rem;
  text-align: center;
}

.option:has(input:checked) {
  border-color: #7a0c0c;
  background: #faf2f2;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 50px;
  }

  .card {
    padding: 32px;
  }

  .candidate-name {
    font-size: 16px;
  }
}
</style>