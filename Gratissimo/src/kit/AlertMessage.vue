<template>
  <div class="alert" :class=" `alert--${tone}`" :role="tone === 'error' ? 'alert' : 'status'">
    <slot />
  </div>
</template>

<script setup>
defineProps({ tone: { type: String, default: 'info' } })
</script>

<style scoped lang="scss">

.alert {
  padding: var(--space-3) var(--space-4);
  border-left: var(--space-1) solid;
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
}

.alert--info {
  border-color: var(--color-info);
  background: var(--color-info-bg);
  color: var(--color-info);
}

.alert--success {
  border-color: var(--color-success);
  background: var(--color-success-bg);
  color: var(--color-success);
}

.alert--error {
  border-color: var(--color-error);
  background: var(--color-error-bg);
  color: var(--color-error);
}

</style>
