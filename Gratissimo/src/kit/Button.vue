<template>
  <button class="button" :class="`button--${variant}`" :type="type">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' }
})
</script>

<style scoped lang="scss">

.button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: var(--border);
  border-radius: var(--radius-pill);
  font: inherit;
  line-height: 1.2;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-text);
}

.button--secondary {
  background: transparent;
  color: var(--color-accent);
}

</style>