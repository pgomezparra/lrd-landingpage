<template>
  <NavBar />
  <div class="l-supply-lists">
    <p class="l-supply-lists__title">Listas de útiles {{ year }}</p>
    <main>
      <section class="l-supply-lists__columns">
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1nXiO0JLKQKEIHzssTbxfj0kcdZ5ClNbV/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/prejardin.webp" alt="pre-jardin" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Pre-Jardín</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/14rOBS41GYj-JqnO9c6AC1Yghw6ZoY2J6/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/jardin.webp" alt="jardín" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Jardín</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1bt2iW7nZLZA-cXgElB8oKC1vg2b7N0ss/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/transicion.webp" alt="transicion" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Transición</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1U5oPuH4_9zqKkgTnav0hv-vrgeYLSVYh/view?usp=sharing"
               target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/home/supply-lists/primaria.webp" alt="primaria" title="" height="" width="" />
            </a>
          </div>
          <figcaption class="column__item-caption"><span>Primaria</span></figcaption>
        </figure>
        <figure class="column__item">
          <div class="column__item-imgwrap">
            <a href="https://drive.google.com/file/d/1nCHMz20JZWUl1dqAPTxzxUmqNJtPn7iT/view?usp=sharing"
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
  <whatsapp />
</template>

<script setup>
import Footer from '@/general/components/Footer.vue'
import NavBar from '@/navbar/components/NavBar.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'

const year = new Date().getFullYear()

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
