<template>
  <section class="category-overview" aria-label="Kategorier af jobs">
    <h2 class="category-overview__title">Find job ved kategori</h2>

    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>

    <div class="category-overview__grid">
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        class="category-overview__item"
        :to="{ path: '/jobs', query: { kategori: category.id } }"
      >
        <span class="category-overview__name">{{ category.name }}</span>
        <span class="category-overview__count">{{ category.count }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { AlertMessage } from '@/kit'
import { getJobCategories, getJobListings } from '@/api'

const categories = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const [list, jobs] = await Promise.all([getJobCategories(), getJobListings()])

    categories.value = list.map((category) => ({
      ...category,
      count: jobs.filter((job) => job.jobCategoryId === category.id).length
    }))
  } catch (err) {
    error.value = err.message
  }
})
</script>

<style scoped lang="scss">
.category-overview {
  width: var(--width-content-wide);
  margin: 0 auto;
  padding: var(--space-2) 0rem;
  background: transparent;

  &__title {
    margin-top: var(--space-4);
    margin-bottom: var(--space-6);
    font-size: var(--font-size-lg);
    font-weight: 400;
    color: var(--color-text);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(140px, 1fr));
    gap: var(--space-4);
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: var(--space-8);
    padding: var(--space-2) var(--space-4);
    border: 1px solid var(--color-text-faint);
    border-radius: var(--space-3);
    background: var(--color-bg);
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
    text-decoration: none;
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
  display: grid;
  grid-template-columns: repeat(2, minmax(170px, 1fr));
  gap: var(--space-4);
  width: var(--space-4)
}
  }
}
</style>