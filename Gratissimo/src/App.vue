<template>
  <!-- Header goes here -->
  
  <!-- Show the current page with header and footer above/below that pages content-->
  <RouterView />

  <SiteFooter/>
</template>

<script setup>
import SiteFooter from './components/SiteFooter.vue';

</script>