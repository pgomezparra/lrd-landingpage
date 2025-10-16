<template>
  <div class="soporte-container-certificate">
    <div class="print-area-certificate">
      <div class="certificate">

        <div class="header-certificate">
          <img src="@/assets/img/logo.png" alt="Logo" class="logo" />
          <div class="institution-info">
            <h1>LICEO REY DAVID</h1>
            <p>PRESCOLAR - PRIMARIA - BACHILLERATO</p>
          </div>
        </div>


        <div class="body-certificate">
          <h2 class="title-certificate">Paz y Salvo</h2>
          <p class="text-certificate">
            El Liceo Rey David hace constar que
            <strong>{{ student.getName().toUpperCase() }} {{ student.getSurname().toUpperCase() }}</strong>,
            matriculado en el grado <strong>{{ student.getGrade().toUpperCase() }}</strong> en el año
            <strong>{{ student.getYear() }}</strong>, se encuentra a
            <strong>Paz y Salvo</strong> con todas sus obligaciones.
          </p>
        </div>

        <!-- Firma -->
        <div class="signature-certificate">
          <div class="line"></div>
          <p>SECRETARIA</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStudentStore } from '@/admin/students/context/store/studentStore.js'

const emit = defineEmits(['closeCertificate'])
const studentsStore = useStudentStore()
const student = studentsStore.selectedStudent

onMounted(() => {
  setTimeout(() => {
    window.print()
    emit('closeCertificate')
  }, 500)
})
</script>

<style>
.soporte-container-certificate {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.print-area-certificate {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.certificate {
  width: 80%;
  max-width: 700px;
  text-align: center;
  font-family: "Times New Roman", serif;
  color: #000;
}

/* Encabezado */
.header-certificate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.logo {
  width: 70px;
  height: auto;
}

.institution-info h1 {
  font-size: 1.2rem;
  margin: 0;
}

.institution-info p {
  font-size: 0.9rem;
  margin: 0;
  text-transform: uppercase;
}

/* Cuerpo */
.body-certificate {
  margin-top: 3rem;
}

.title-certificate {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
}

.text-certificate {
  text-align: justify;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Firma */
.signature-certificate {
  text-align: center;
  margin-top: 4rem;
}

.signature-certificate .line {
  border-top: 1px solid #000;
  width: 50%;
  margin: 0 auto 0.3rem;
}

.signature-certificate p {
  margin: 0;
  font-weight: 500;
  font-size: 0.9rem;
}

/* --- Configuración para impresión --- */
@media print {
  @page {
    size: 5.5in 8.5in landscape;
    margin: 1cm;
  }

  body * {
    visibility: hidden !important;
  }

  .print-area-certificate, .print-area-certificate * {
    visibility: visible !important;
  }

  .print-area-certificate {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .soporte-container-certificate {
    background: white !important;
    padding: 0;
    margin: 0;
  }
}
</style>