<template>
  <section class="slider" :aria-label="label">
    <slot :item="items[index]" />

    <div class="slider__dots">
      <button
        v-for="(item, i) in items"
        :key="i"
        class="slider__dot"
        type="button"
        :aria-label="`Vis nummer ${i + 1} af ${label}`"
        :aria-current="i === index || undefined"
        @click="index = i"
      />
    </div>
  </section>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  label: { type: String, required: true },
  interval: { type: Number, default: 5000 }
})

const index = ref(0)

// Repeat when the loop reaches the end of the array
const timer = setInterval(() => {
  index.value = (index.value + 1) % props.items.length
}, props.interval)

onUnmounted(() => clearInterval(timer))
</script>

<style scoped lang="scss">
.slider {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__dots {
    display: flex;
    gap: var(--space-5);
    margin-top: var(--space-5);
  }

  &__dot {
    width: var(--space-3);
    height: var(--space-3);
    padding: 0;
    border: 1px solid var(--color-text-faint);
    border-radius: 50%;
    background: none;
    cursor: pointer;

    &[aria-current] {
      border-color: var(--color-accent-dark);
      background: var(--color-accent-dark);
    }
  }
}
</style>