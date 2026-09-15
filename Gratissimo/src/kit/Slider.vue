<template>
  <section class="slider" :aria-label="label">
    <slot :item="items[index]" />

    <div class="slider__dots">
      <button
        v-for="(i) in items"
        :key="i"
        class="slider__dot"
        type="button"
        :aria-label="`Vis nummer ${i + 1} af testimonies`"
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
  &__dots {
    display: flex;
  }

  &__dot {
    width: var(--space-3);
    height: var(--space-3);
    border-radius: 50%;

    &[aria-current] {
      background: var(--color-accent);
    }
  }
}
</style>
