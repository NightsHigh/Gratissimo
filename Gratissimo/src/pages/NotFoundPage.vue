<template>
  <h1>Siden findes ikke</h1>

  <AlertMessage tone="info">
    Siden her er enten flyttet, eller også har den aldrig været her.
  </AlertMessage>

  <p>
    <RouterLink to="/">Gå til forsiden</RouterLink>
  </p>
</template>

<script setup>
import { AlertMessage } from '@/kit'
</script>
