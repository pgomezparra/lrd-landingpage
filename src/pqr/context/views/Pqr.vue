<template>
  <Navbar />
  <div class="l-pqr">
    <PageHeader
      eyebrow="Atención a la comunidad"
      title="Peticiones, Quejas, Reclamos y Sugerencias"
      subtitle="Comparte tu solicitud con nosotros. Cada mensaje nos ayuda a seguir construyendo una mejor comunidad educativa."
    />
    <main class="l-pqr__main">
      <div class="l-pqr__container">
        <aside class="l-pqr__info">
          <span class="l-pqr__eyebrow">Estamos para escucharte</span>
          <h2 class="l-pqr__title">Tu voz nos ayuda a mejorar</h2>
          <p class="l-pqr__text">
            Diligencia el formulario con tus datos y el detalle de tu solicitud. Nuestro equipo de
            secretaría revisará tu mensaje y dará respuesta por los canales de contacto.
          </p>

          <ul class="l-pqr__list">
            <li>
              <span class="l-pqr__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
                </svg>
              </span>
              <div>
                <strong>Teléfonos</strong>
                <a href="tel:+573158317079">315 831 7079</a>
                <a href="tel:+573184010834">318 401 0834</a>
              </div>
            </li>
            <li>
              <span class="l-pqr__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                     stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 6 10-6" />
                </svg>
              </span>
              <div>
                <strong>Correo electrónico</strong>
                <a href="mailto:secretaria@liceoreydavid.edu.co">secretaria@liceoreydavid.edu.co</a>
              </div>
            </li>
            <li>
              <span class="l-pqr__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                     stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <strong>Horario de atención</strong>
                <span>Lunes a viernes · 6:50 a. m. - 12:00 p. m.</span>
              </div>
            </li>
          </ul>
        </aside>

        <form class="o-pqr-form" @submit.prevent="createPqr">
          <h2 class="o-pqr-form__title">Envíanos tu PQR</h2>
          <p class="o-pqr-form__hint">Los campos son obligatorios.</p>

          <div class="o-pqr-form__field">
            <label for="pqr-name">Nombre completo</label>
            <input
              id="pqr-name"
              v-model="form.name"
              type="text"
              placeholder="Ingrese su nombre completo"
            />
          </div>

          <div class="o-pqr-form__field">
            <label for="pqr-email">Correo electrónico</label>
            <input
              id="pqr-email"
              v-model="form.email"
              type="email"
              placeholder="Ingrese su correo electrónico"
            />
          </div>

          <div class="o-pqr-form__field">
            <label for="pqr-message">Su petición, queja o reclamo</label>
            <textarea
              id="pqr-message"
              v-model="form.message"
              rows="5"
              placeholder="Escriba aquí su PQR"
            ></textarea>
          </div>

          <p v-if="error" class="o-pqr-form__message error">{{ error }}</p>
          <p v-if="success" class="o-pqr-form__message success">{{ success }}</p>

          <button type="submit" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Enviar PQR' }}
          </button>
        </form>
      </div>
    </main>
    <Footer />
  </div>
  <whatsapp />
</template>

<script setup>
import { ref } from 'vue'
import Footer from '@/general/components/Footer.vue'
import PageHeader from '@/general/components/PageHeader.vue'
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

    const successResponse = await pqrStore.createPqr(
      form.value.name,
      form.value.email,
      form.value.message
    )

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
