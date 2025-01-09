<template>
  <div class="l-supply-lists">
    <p class="l-supply-lists__title">Listas de útiles 2025</p>
    <main>
      <section class="l-supply-lists__columns">
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1aLDWCGntkbt1jgk9AtDcfFfQCdVV8eaE/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/prejardin.webp" alt="pre-jardin" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Pre-Jardín</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1LCK_N2ZrOhlu9n2tIs4_Ohi2G_Q3pUFq/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/jardin.webp" alt="jardín" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Jardín</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/16iohuIGqhKFCyBzy_JurpMaDz_y1La-1/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/transicion.webp" alt="transicion" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Transición</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1Zlv8KcvC0W8433nyO0ocLHflotQwU-us/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/primaria.webp" alt="primaria" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Primaria</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1iOM-TDF3wBug0Zu7LhFFqc5BuNyxXv1G/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/bachillerato.webp" alt="bachillerato" title="" height=""
                   width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Bachillerato</span></figcaption>
        </figure>
      </section>
      <Footer />
    </main>
  </div>
</template>

<script setup>
import Footer from '@/general/components/Footer.vue'

</script>

<style scoped>
.column__item {
  margin: 1em;
}

.column__item-imgwrap img {
  border-radius: 1em;
  width: 100%;
  height: auto;
  aspect-ratio: 0.75;
  object-fit: cover;
  cursor: pointer;
}

.column__item-caption {
  text-align: center;
}
</style>
