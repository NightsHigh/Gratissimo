<template>
  <div class="testimonial">
    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>

    <Slider v-if="slides.length" :items="slides" label="Udtalelser">
      <template #default="{ item }">
        <h2 class="testimonial__title">{{ item.title }}</h2>
        <p class="testimonial__text">{{ item.content }}</p>
        <p class="testimonial__author">{{ item.name }}</p>
      </template>
    </Slider>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { AlertMessage, Slider } from '@/kit'
import { getTestimonies } from '@/api'

const slides = ref([])
const error = ref('')

onMounted(async () => {
  try {
    slides.value = await getTestimonies()
  } catch (err) {
    error.value = err.message
  }
})
</script>

<style scoped lang="scss">
.testimonial {
  padding: var(--space-6) var(--space-4);
  background: var(--color-page);
  text-align: center;

  &__title {
    margin: 0 0 var(--space-5);
    color: var(--color-accent-dark);
    font-size: var(--font-size-xl);
    font-weight: 400;
  }

  &__text {
    max-width: 40rem;
    margin: 0 auto var(--space-5);
    font-size: var(--font-size-medium);
    font-weight: 200;
  }

  &__author {
    margin: 0;
    color: var(--color-text-faint);
  }
}
</style>