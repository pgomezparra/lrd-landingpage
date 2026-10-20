<template>
  <Navbar />
  <div class="l-admissions">
    <PageHeader
      eyebrow="Admisiones"
      title="Requisitos de inscripción"
      subtitle="Conoce los documentos, costos y pasos para hacer parte de la comunidad del Liceo Rey David."
    />
    <main class="l-admissions__main">
      <div class="l-admissions__container">
        <section class="o-admissions-card">
          <header class="o-admissions-card__heading">
            <span class="o-admissions-card__index">01</span>
            <div>
              <h2 class="o-admissions-card__title">Requisitos de inscripción</h2>
              <p class="o-admissions-card__lead">Documentos necesarios para formalizar el proceso.</p>
            </div>
          </header>
          <div class="o-admissions-card__content">
            <h3 class="o-admissions-card__subtitle">Requisitos para todos los estudiantes</h3>
            <ul class="o-admissions-card__list">
              <li>Formulario de inscripción</li>
              <li>Registro civil de nacimiento</li>
              <li>Fotocopia de Tarjeta de Identidad (si aplica)</li>
              <li>Fotocopia de la cédula de los padres o acudientes</li>
              <li>Copia del observador del alumno (para primaria y bachillerato)</li>
            </ul>

            <h3 class="o-admissions-card__subtitle">Requisitos adicionales para estudiantes nuevos</h3>
            <ul class="o-admissions-card__list">
              <li>Boletines años anteriores</li>
              <li>Carné de Sisben o EPS</li>
              <li>Certificados de notas desde quinto</li>
              <li>Paz y salvo año anterior</li>
              <li>Certificado de Retiro del SIMAT</li>
              <li>Carpeta colgante oficio azul con gancho</li>
            </ul>

            <h3 class="o-admissions-card__subtitle">Requisitos adicionales para estudiantes antiguos</h3>
            <ul class="o-admissions-card__list">
              <li>Presentar boletín del año anterior</li>
            </ul>

            <p class="o-admissions-card__note">
              Nota: Algunos documentos adicionales pueden ser requeridos dependiendo del nivel
              educativo y las circunstancias particulares del estudiante.
            </p>
          </div>
        </section>

        <section class="o-admissions-card">
          <header class="o-admissions-card__heading">
            <span class="o-admissions-card__index">02</span>
            <div>
              <h2 class="o-admissions-card__title">Costos por nivel educativo</h2>
              <p class="o-admissions-card__lead">Valores de referencia para la vigencia actual.</p>
            </div>
          </header>
          <div class="o-admissions-card__content">
            <div class="o-admissions-card__content__table-wrapper">
              <table class="o-admissions-card__content__table-wrapper__table">
                <thead>
                <tr>
                  <th>Nivel</th>
                  <th>Matrícula</th>
                  <th>Pensión mensual</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Preescolar</td>
                  <td>$270.000</td>
                  <td>$125.000</td>
                </tr>
                <tr>
                  <td>Primaria</td>
                  <td>$270.000</td>
                  <td>$125.000</td>
                </tr>
                <tr>
                  <td>6º a 9º</td>
                  <td>$300.000</td>
                  <td>$140.000</td>
                </tr>
                <tr>
                  <td>10º a 11º</td>
                  <td>$310.000</td>
                  <td>$145.000</td>
                </tr>
                </tbody>
              </table>
            </div>

            <h3 class="o-admissions-card__subtitle">Incluye</h3>
            <ul class="o-admissions-card__list o-admissions-card__list--columns">
              <li>Matrícula</li>
              <li>Seguro estudiantil (contra accidentes)</li>
              <li>Carné estudiantil</li>
              <li>Fotos</li>
              <li>Sistematización y papelería</li>
              <li>Agenda escolar</li>
            </ul>

            <p class="o-admissions-card__note">
              Nota: Los costos pueden estar sujetos a cambios. Por favor, contacte a la
              administración para obtener información actualizada.
            </p>
          </div>
        </section>

        <section class="o-admissions-card o-admissions-card--contact">
          <header class="o-admissions-card__heading">
            <span class="o-admissions-card__index">03</span>
            <div>
              <h2 class="o-admissions-card__title">Información adicional</h2>
              <p class="o-admissions-card__lead">
                Agenda una visita o resuelve tus dudas con nuestra oficina de admisiones.
              </p>
            </div>
          </header>
          <div class="o-admissions-card__content">
            <p>
              Para más detalles sobre el proceso de inscripción o para agendar una visita a
              nuestras instalaciones, por favor contacte a nuestra oficina de admisiones:
            </p>
            <ul class="o-admissions-card__list o-admissions-card__list--contact">
              <li>
                Teléfono:
                <a class="o-admissions-card__link" href="tel:+573158317079">3158317079</a>
                -
                <a class="o-admissions-card__link" href="tel:+573184010834">3184010834</a>
              </li>
              <li>
                Email:
                <a class="o-admissions-card__link" href="mailto:secretaria@liceoreydavid.edu.co">
                  secretaria@liceoreydavid.edu.co
                </a>
              </li>
              <li>Horario de atención: Lunes a Viernes de 6:50 am - 12:00 pm</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
  <whatsapp />
</template>

<script setup>
import Footer from '@/general/components/Footer.vue'
import Navbar from '@/navbar/components/NavBar.vue'
import PageHeader from '@/general/components/PageHeader.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'
</script>
