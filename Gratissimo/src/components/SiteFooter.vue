<template>
  <footer class="footer">
    <div class="footer__inner">

    <!--For jobsøgere-->
      <nav class="footer__col" aria-labelledby="footer-jobsoegere">
        <h2 id="footer-jobsoegere" class="footer__heading">For jobsøgere</h2>
        <ul class="footer__list">
          <li><a href="#">Din kundeside</a></li>
          <li><a href="#">Opret profil</a></li>
          <li><a href="#">Gemte jobs</a></li>
        </ul>
      </nav>


    <!--For arbejdsgivere-->
      <nav class="footer__col" aria-labelledby="footer-arbejdsgivere">
        <h2 id="footer-arbejdsgivere" class="footer__heading">For arbejdsgivere</h2>
        <ul class="footer__list">
          <li><a href="#">Virksomhedsprofil</a></li>
          <li><a href="#">Opret annonce</a></li>
          <li><a href="#">Jobannoncering</a></li>
          <li><a href="#">Rekruttering</a></li>
        </ul>
      </nav>

    <!--Links-->
      <nav class="footer__col" aria-labelledby="footer-links">
        <h2 id="footer-links" class="footer__heading">Links</h2>
        <ul class="footer__list">
          <li><a href="#">Om Gratissimo</a></li>
          <li><a href="#">Job hos os</a></li>
          <li><a href="#">For investorer</a></li>
          <li><a href="#">Presse</a></li>
        </ul>
      </nav>


      <!--Newsletter-->
      <div class="footer__col">
        <h2 class="footer__heading">Vil du have jobs direkte i din indbakke?</h2>
        <p class="footer__lead">Tilmeld dig vores elektroniske nyhedsbrev</p>
        <NewsletterForm />
      </div>


      <!--Address-->
      <div class="footer__col">
        <address class="footer__address">
          Fidusvej 23<br>
          9230 Øster Lundby<br>
          +45 22 13 22 13
        </address>

        <!--Socials-->
        <ul class="footer__social">
          <li v-for="link in social" :key="link.name">
            <a href="#" :aria-label="link.name">
              <img :src="link.icon" alt="">
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup>
import NewsletterForm from './NewsletterForm.vue'
import facebook from '@/assets/icons/SoMe/Facebook.png'
import googlePlus from '@/assets/icons/SoMe/Google Plus.png'
import instagram from '@/assets/icons/SoMe/Instagram Circle.png'
import linkedIn from '@/assets/icons/SoMe/LinkedIn Circled.png'

const social = [
  { name: 'LinkedIn', icon: linkedIn },
  { name: 'Facebook', icon: facebook },
  { name: 'Instagram', icon: instagram },
  { name: 'Google Plus', icon: googlePlus }
]
</script>

<style scoped lang="scss">
.footer {
  background: var(--color-accent);
  color: var(--color-accent-text);

  a {
    color: inherit;
  }

  &__inner {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    max-width: var(--width-page);
    margin: 0 auto;
  }

  &__list {
    list-style: none;
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-5) var(--space-4);
  }
  
  &__social {
    display: flex;
    list-style: none;

    img {
      width: 2rem;
    }
  }
}
</style>