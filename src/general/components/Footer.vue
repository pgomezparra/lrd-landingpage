<template>
  <footer class="o-footer">
    <div class="o-footer__inner">
      <div class="o-footer__brand">
        <div class="o-footer__logo">
          <img src="@/assets/img/logo.png" alt="Logo del Liceo Rey David" />
          <div>
            <strong>Liceo Rey David</strong>
            <span>Educación con principios y valores</span>
          </div>
        </div>
        <p class="o-footer__description">
          Acompañamos la formación académica, personal y espiritual de nuestros estudiantes desde
          preescolar hasta bachillerato.
        </p>
        <div class="o-footer__social">
          <a
            href="https://www.instagram.com/colegioliceoreydavid/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram del colegio"
          >
            <img src="@/assets/img/general/instagram.svg" alt="" />
          </a>
          <a
            href="https://www.facebook.com/liceo.rey"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook del colegio"
          >
            <img src="@/assets/img/general/facebook.svg" alt="" />
          </a>
        </div>
      </div>

      <nav class="o-footer__column" aria-label="Enlaces del sitio">
        <h4>Navegación</h4>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/admissions">Admisiones</RouterLink>
        <RouterLink to="/news">Noticias</RouterLink>
        <RouterLink to="/pqr">PQR</RouterLink>
        <RouterLink to="/institutional">Institucional</RouterLink>
      </nav>

      <div class="o-footer__column">
        <h4>Contacto</h4>
        <a
          href="https://www.google.com/maps/place/Liceo+Rey+David/@7.1765305,-73.1362437,17z/data=!3m1!4b1!4m6!3m5!1s0x8e6814f6376aff57:0x1d7c9dc9f744bab0!8m2!3d7.1765252!4d-73.1336688!16s%2Fg%2F11c1nypynl?entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
          class="o-footer__contact"
        >
          <img src="@/assets/img/general/map-pointer.svg" alt="" />
          Transversal 21 # 50N - 49
        </a>
        <a class="o-footer__contact" href="tel:+573158317079">
          <span class="o-footer__bullet"></span>
          315 831 7079
        </a>
        <a class="o-footer__contact" href="mailto:secretaria@liceoreydavid.edu.co">
          <span class="o-footer__bullet"></span>
          secretaria@liceoreydavid.edu.co
        </a>
        <span class="o-footer__schedule">Lunes a viernes · 6:50 a. m. - 12:00 p. m.</span>
      </div>
    </div>

    <div class="o-footer__bottom">
      <p>© {{ new Date().getFullYear() }} Liceo Rey David. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup></script>
