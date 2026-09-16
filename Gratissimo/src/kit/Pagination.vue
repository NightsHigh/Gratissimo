<template>
  <nav v-if="pageCount > 1" class="pagination" aria-label="Pagination">
    <ul class="pagination__list">
      <li>
        <button
          class="pagination__step"
          type="button"
          :disabled="page === 1"
          aria-label="Previous page"
          @click="emit('pageChange', page - 1)"
        >
          <img :src="backArrow" alt="Previous page" />
        </button>
      </li>

      <li v-for="n in pageCount" :key="n">
        <button
          class="pagination__page"
          :class="{ 'is-active': n === page }"
          type="button"
          :aria-current="n === page ? 'page' : undefined"
          @click="emit('pageChange', n)"
        >
          {{ n }}
        </button>
      </li>

      <li>
        <button
          class="pagination__step"
          type="button"
          :disabled="page === pageCount"
          aria-label="Next page"
          @click="emit('pageChange', page + 1)"
        >
          <img :src="forwardArrow" alt="Next page" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import backArrow from '@/assets/icons/icons8-back-30.png'
import forwardArrow from '@/assets/icons/icons8-forward-30.png'

defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true }
})
const emit = defineEmits(['pageChange'])
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
}

.pagination__list {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0;
  padding: 0.45rem 0.8rem;
  list-style: none;
  border: 1px solid #d8d1ce;
  border-radius: 999px;
  background: rgba(245, 242, 241, 0.75);
}

.pagination button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d0c7c3;
  background: var(--color-surface);
  color: #1d1d1d;
  cursor: pointer;
  font: inherit;
  transition: all 0.2s ease;
}

.pagination button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination__step {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  padding: 0;
}

.pagination__step img {
  display: block;
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  margin: 0 auto;
}

.pagination__page {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  padding: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

.pagination__page.is-active,
.pagination__page[aria-current='page'] {
  border-color: var(--color-accent-dark);
  background: var(--color-accent-dark);
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}
</style>
