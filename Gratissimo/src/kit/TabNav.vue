<template>
  <nav class="tab-nav" :aria-label="label">
    <ul class="tab-nav__list">
      <li v-for="item in items" :key="item.to">
        <RouterLink :to="item.to" class="tab-nav__tab">
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  label: { type: String, default: 'Main navigation' }
})
</script>

<style scoped lang="scss">
.tab-nav {
  display: flex;
  align-items: center;
}

.tab-nav__list {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  list-style: none;
  margin: 0;
  padding: 0;
}

.tab-nav__tab {
  color: #fff;
  text-decoration: none;
  font-weight: 400;
}

.tab-nav__tab[aria-current='page'] {
  font-weight: 600;
  text-decoration: underline;
}
</style>