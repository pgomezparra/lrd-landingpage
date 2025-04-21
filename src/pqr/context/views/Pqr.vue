<template>
  <Navbar />
  <div class="l-pqr">
    <h1 class="l-pqr__container__title">Peticiones, Quejas, Reclamos y Sugerencias</h1>
    <main>
      <div class="l-pqr__container">

        <section class="o-pqr-form">
          <span>Nombre completo</span>
          <input v-model="form.name" type="text" placeholder="Ingrese su nombre completo" />

          <span>Correo electrónico</span>
          <input v-model="form.email" type="email" placeholder="Ingrese su correo electrónico" />

          <span>Su petición, queja o reclamo</span>
          <textarea v-model="form.message" rows="5" placeholder="Escriba aquí su PQR"></textarea>

          <p v-if="error" class="o-pqr-form__message error">{{ error }}</p>
          <p v-if="success" class="o-pqr-form__message success">{{ success }}</p>

          <button :disabled="loading" @click="createPqr">
            {{ loading ? "Enviando..." : "Enviar PQR" }}
          </button>
        </section>
      </div>
    </main>
    <Footer />
  </div>
  <whatsapp />
</template>

<script setup>
import { ref } from 'vue'
import Footer from '@/general/components/Footer.vue'
import { usePqrStore } from '@/pqr/context/store/pqrStore.js'
import Navbar from '@/navbar/components/NavBar.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'

const pqrStore = usePqrStore()

const form = ref({
  name: '',
  email: '',
  message: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)


const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}


const createPqr = async () => {
  error.value = ''
  success.value = ''

  if (!form.value.name || !form.value.email || !form.value.message) {
    error.value = 'Por favor complete todos los campos.'
    return
  }

  if (!validateEmail(form.value.email)) {
    error.value = 'Por favor ingrese un correo electrónico válido.'
    return
  }

  try {
    loading.value = true

    const successResponse = await pqrStore.createPqr(form.value.name, form.value.email, form.value.message)

    if (successResponse) {
      success.value = 'PQR enviada con éxito.'
      form.value = { name: '', email: '', message: '' }
    } else {
      error.value = 'Ocurrió un error al enviar la PQR. Por favor, intente de nuevo.'
    }
  } catch (err) {
    error.value = 'Ocurrió un error al enviar la PQR. Por favor, intente de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.o-pqr-form__message {
  margin-top: 10px;
  font-size: 14px;
}


</style>
