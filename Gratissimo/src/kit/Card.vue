<template>
  <article class="card">
    <div v-if="$slots.image" class="card__image"><slot name="image" /></div>
    <div class="card__body">
      <div v-if="$slots.meta" class="card__meta"><slot name="meta" /></div>
      <component :is="`h${headingLevel}`" class="card__title">{{ title }}</component>
      <div class="card__text"><slot /></div>
    </div>
    <footer v-if="$slots.footer" class="card__footer"><slot name="footer" /></footer>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  headingLevel: { type: Number, default: 3 }
})
</script>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border: var(--border);
  border-radius: var(--radius);
  overflow: hidden;

  &__image :deep(img) {
    display: block;
    width: 100%;
  }

  &__body {
    padding: var(--space-4);
  }

  &__meta {
    margin-bottom: var(--space-3);
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 400;
  }

  &__footer {
    margin-top: auto;
    padding: var(--space-4);
    border-top: var(--border);
  }
}
</style>