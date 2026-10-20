<template>
  <Navbar />
  <div class="l-gallery">
    <PageHeader
      eyebrow="Nuestra historia"
      title="Una historia que comenzó con un llamado"
      subtitle="Un recorrido por los momentos, las personas y las decisiones que dieron forma al Liceo Rey David."
    />

    <main class="l-gallery__main">
      <div class="story">
        <nav class="story__nav" aria-label="Capítulos de nuestra historia">
          <button
            v-for="chapter in chapters"
            :key="chapter.id"
            type="button"
            @click="goToChapter(chapter.id)"
          >
            <span>{{ chapter.number }}</span>
            {{ chapter.navLabel }}
          </button>
        </nav>

        <section
          v-for="(chapter, index) in chapters"
          :id="chapter.id"
          :key="chapter.id"
          class="story__chapter"
          :class="{ 'story__chapter--reverse': index % 2 === 1 }"
        >
          <div class="story__media">
            <figure class="story__main" @click="openImage(chapter.images[0])">
              <img :src="chapter.images[0].src" :alt="chapter.images[0].alt" />
            </figure>
            <div class="story__thumbs">
              <figure
                v-for="image in chapter.images.slice(1)"
                :key="image.alt"
                class="story__thumb"
                @click="openImage(image)"
              >
                <img :src="image.src" :alt="image.alt" />
              </figure>
            </div>
          </div>

          <div class="story__copy">
            <span class="story__index">{{ chapter.number }}</span>
            <span class="story__eyebrow">{{ chapter.eyebrow }}</span>
            <h2 class="story__title">{{ chapter.title }}</h2>
            <p v-for="paragraph in chapter.paragraphs" :key="paragraph" class="story__text">
              {{ paragraph }}
            </p>
            <blockquote v-if="chapter.quote" class="story__quote">
              “{{ chapter.quote }}”
            </blockquote>
          </div>
        </section>

        <section class="story__closing">
          <img src="@/assets/img/gallery/24.webp" alt="Estudiantes del Liceo Rey David" />
          <div class="story__closing-content">
            <span class="story__eyebrow">Hoy</span>
            <h2>La historia continúa</h2>
            <p>
              Más de 30 años después, seguimos formando en principios y valores cristianos. La
              historia continúa con cada estudiante que descubre su propósito y con cada familia que
              confía en nosotros.
            </p>
            <div class="story__actions">
              <button type="button" class="story__action story__action--primary" @click="goToAdmissions">
                Proceso de admisión
              </button>
              <button type="button" class="story__action story__action--ghost" @click="goToNews">
                Ver noticias
              </button>
            </div>
          </div>
        </section>

        <section class="story__archive">
          <div class="story__archive-head">
            <span class="story__eyebrow">Archivo fotográfico</span>
            <h2>Momentos que nos han formado</h2>
            <p>Una selección de fotografías que guardan la memoria de nuestra comunidad.</p>
          </div>
          <div class="story__archive-grid">
            <figure
              v-for="image in archiveImages"
              :key="image.alt"
              class="story__archive-item"
              @click="openImage(image)"
            >
              <img :src="image.src" :alt="image.alt" loading="lazy" />
            </figure>
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </div>
  <whatsapp />

  <div v-if="selectedImage" class="story__lightbox" @click.self="closeImage">
    <button type="button" class="story__lightbox-close" aria-label="Cerrar imagen" @click="closeImage">
      ×
    </button>
    <img :src="selectedImage.src" :alt="selectedImage.alt" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '@/general/components/Footer.vue'
import Navbar from '@/navbar/components/NavBar.vue'
import PageHeader from '@/general/components/PageHeader.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'
import { useNavbarStore } from '@/navbar/store/navbarStore.js'

import Photo1 from '@/assets/img/gallery/1.webp'
import Photo2 from '@/assets/img/gallery/2.webp'
import Photo3 from '@/assets/img/gallery/3.webp'
import Photo4 from '@/assets/img/gallery/4.webp'
import Photo5 from '@/assets/img/gallery/5.webp'
import Photo6 from '@/assets/img/gallery/6.webp'
import Photo7 from '@/assets/img/gallery/7.webp'
import Photo8 from '@/assets/img/gallery/8.webp'
import Photo9 from '@/assets/img/gallery/9.webp'
import Photo10 from '@/assets/img/gallery/10.webp'
import Photo11 from '@/assets/img/gallery/11.webp'
import Photo12 from '@/assets/img/gallery/12.webp'
import Photo13 from '@/assets/img/gallery/13.webp'
import Photo14 from '@/assets/img/gallery/14.webp'
import Photo15 from '@/assets/img/gallery/15.webp'
import Photo16 from '@/assets/img/gallery/16.webp'
import Photo17 from '@/assets/img/gallery/17.webp'
import Photo18 from '@/assets/img/gallery/18.webp'
import Photo19 from '@/assets/img/gallery/19.webp'
import Photo20 from '@/assets/img/gallery/20.webp'
import Photo21 from '@/assets/img/gallery/21.webp'
import Photo22 from '@/assets/img/gallery/22.webp'
import Photo23 from '@/assets/img/gallery/23.webp'
import Photo24 from '@/assets/img/gallery/24.webp'

const router = useRouter()
const navbarStore = useNavbarStore()

const selectedImage = ref(null)

const chapters = [
  {
    id: 'el-llamado',
    navLabel: 'El llamado',
    number: '01',
    eyebrow: 'El origen',
    title: 'Todo comenzó con un llamado',
    paragraphs: [
      'El pastor Pedro Gómez y su esposa Gladys Parra recibieron el llamado de Dios de abrir un jardín infantil. Con fe, dedicación y el deseo de servir a las familias, dieron el primer paso de lo que hoy es el Liceo Rey David.'
    ],
    quote: 'Un proyecto nacido para cuidar, enseñar y formar con amor.',
    images: [
      { src: Photo1, alt: 'El pastor Pedro Gómez y Gladys Parra, fundadores del Liceo Rey David' },
      { src: Photo2, alt: 'Retrato de los fundadores del Liceo Rey David' }
    ]
  },
  {
    id: 'primeros-pasos',
    navLabel: 'Primeros pasos',
    number: '02',
    eyebrow: 'Los inicios',
    title: 'Un jardín que empezó a crecer',
    paragraphs: [
      'En la sede de la Iglesia del Nazareno comenzó a tomar forma el sueño. Allí, entre aulas sencillas, celebraciones y momentos de oración, los primeros estudiantes encontraron un espacio para aprender y crecer.',
      'Las primeras generaciones compartieron juegos, actos y jornadas de estudio que sentaron las bases de una comunidad unida por los mismos valores.'
    ],
    images: [
      { src: Photo3, alt: 'Primera sede del Liceo Rey David en la Iglesia del Nazareno' },
      { src: Photo5, alt: 'Estudiantes orando en los primeros años del colegio' },
      { src: Photo4, alt: 'Celebración del Día de los Niños en la primera sede' }
    ]
  },
  {
    id: 'nueva-sede',
    navLabel: 'La nueva sede',
    number: '03',
    eyebrow: 'El crecimiento',
    title: 'Una sede construida entre todos',
    paragraphs: [
      'La comunidad se unió para construir una nueva sede. El letrero que acompañó la obra lo dejó claro desde el inicio: “Aquí se construirá la sede para el Liceo Rey David”.',
      'Cada columna, cada aula y cada espacio se levantaron con el esfuerzo de muchas familias, convencidas de que los estudiantes merecían mejores oportunidades para aprender.'
    ],
    quote: 'Seguid la paz y la santidad, sin la cual nadie verá al Señor.',
    images: [
      { src: Photo8, alt: 'Letrero de la construcción de la nueva sede del Liceo Rey David' },
      { src: Photo17, alt: 'Edificio del Liceo Rey David en construcción' },
      { src: Photo18, alt: 'Aula en construcción de la nueva sede' }
    ]
  },
  {
    id: 'comunidad',
    navLabel: 'La comunidad',
    number: '04',
    eyebrow: 'La vida escolar',
    title: 'Una comunidad que crece junta',
    paragraphs: [
      'Con los años, el jardín infantil creció hasta convertirse en un colegio con preescolar, primaria y bachillerato.',
      'Las aulas, los actos cívicos, las elecciones escolares y la vida diaria reflejan una comunidad que aprende, participa y se acompaña.'
    ],
    images: [
      { src: Photo23, alt: 'Estudiantes trabajando en el aula' },
      { src: Photo19, alt: 'Estudiantes compartiendo en la terraza del colegio' },
      { src: Photo21, alt: 'Jornada de elecciones escolares' }
    ]
  }
]

const archiveImages = [
  { src: Photo1, alt: 'Fundadores del Liceo Rey David' },
  { src: Photo2, alt: 'Retrato de los fundadores' },
  { src: Photo3, alt: 'Primera sede del colegio' },
  { src: Photo4, alt: 'Celebración del Día de los Niños' },
  { src: Photo5, alt: 'Momento de oración de los estudiantes' },
  { src: Photo6, alt: 'Grupo de estudiantes de los primeros años' },
  { src: Photo7, alt: 'Aula de los primeros años' },
  { src: Photo8, alt: 'Letrero de la nueva sede' },
  { src: Photo9, alt: 'Terreno donde se construyó la sede' },
  { src: Photo10, alt: 'Inicio de la construcción de la sede' },
  { src: Photo11, alt: 'Columnas de la nueva sede' },
  { src: Photo12, alt: 'Trabajos de excavación' },
  { src: Photo13, alt: 'Construcción de la placa de la sede' },
  { src: Photo14, alt: 'Jornada de construcción' },
  { src: Photo15, alt: 'Obreros trabajando en la estructura' },
  { src: Photo16, alt: 'Llegada de concreto para la obra' },
  { src: Photo17, alt: 'Edificio en construcción' },
  { src: Photo18, alt: 'Aula en construcción' },
  { src: Photo19, alt: 'Estudiantes en la terraza' },
  { src: Photo20, alt: 'Estudiantes de bachillerato' },
  { src: Photo21, alt: 'Elecciones escolares' },
  { src: Photo22, alt: 'Estudiantes escribiendo en clase' },
  { src: Photo23, alt: 'Estudiantes en el aula' },
  { src: Photo24, alt: 'Estudiantes del Liceo Rey David' }
]

const goToChapter = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const openImage = (image) => {
  selectedImage.value = image
}

const closeImage = () => {
  selectedImage.value = null
}

const goToAdmissions = () => {
  navbarStore.setActualMenu('admissions')
  router.push('/admissions')
}

const goToNews = () => {
  navbarStore.setActualMenu('public-news')
  router.push('/news')
}
</script>
