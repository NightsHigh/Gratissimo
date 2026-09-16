<template>
  <section class="category-overview" aria-label="Kategorier af jobs">
    <h2 class="category-overview__title">Find job ved kategori</h2>

    <div class="category-overview__grid">
      <button
        v-for="category in categories"
        :key="category.name"
        type="button"
        class="category-overview__item"
        @click="goToCategory(category.name)"
      >
        <span class="category-overview__name">{{ category.name }}</span>
        <span class="category-overview__count">{{ category.count }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const defaultCategories = [
  { name: 'Undervisning', count: 42 },
  { name: 'Håndværk', count: 24 },
  { name: 'Kommunikation', count: 81 },
  { name: 'Teknologi', count: 23 },
  { name: 'Industri', count: 19 },
  { name: 'Kontor', count: 42 },
  { name: 'Kultur', count: 84 },
  { name: 'Service', count: 64 },
  { name: 'Øvrige', count: 14 }
]

const categories = computed(() => defaultCategories)

const goToCategory = (name) => {
  router.push({
    path: '/jobs',
    query: { category: name }
  })
}
</script>

<style scoped lang="scss">
.category-overview {
  width: var(--width-content-wide);
  margin: 0 auto;
  padding: 3rem 0rem;
  background: transparent;

  &__title {
    margin: 0 0 1rem;
    font-size: clamp(1.5rem, 1.2vw + 1rem, 2.1rem);
    font-weight: 400;
    color: var(--color-text);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(170px, 1fr));
    gap: 3rem;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    min-height: 3.5rem;
    padding: 0.9rem 1rem;
    border: 1px solid #d7d0ce;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.75);
    color: var(--color-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
    }
  }

  &__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__count {
    min-width: 2.1rem;
    text-align: right;
    font-weight: 600;
    color: var(--color-text-muted);
  }
}

@media (max-width: 700px) {
  .category-overview {
    &__grid {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
    }
  }
}
</style>
