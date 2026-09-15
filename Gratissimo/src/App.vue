<template>
  <Header />
  <Nav/> 
  <CTA />

  <!-- Show the current page with header/Nav/CTA and footer above/below that pages content-->
  <RouterView />

  <SiteFooter/>
</template>

<script setup>
import SiteFooter from './components/SiteFooter.vue';
import Header from './components/Header.vue';
import CTA from './components/CTA.vue';
import Nav from './components/Navbar.vue';

</script>