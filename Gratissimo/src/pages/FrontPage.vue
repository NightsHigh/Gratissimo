<template>
  <div>
    <div class="front-page__search">
      <Search />
    </div>

    <CategoryOverview />
    <FeaturedNews :limit="3"/>
    <TestimonivesSlider />
  </div>
</template>

<script setup>
import Search from '@/components/Search.vue'
import CategoryOverview from '@/components/CategoryOverview.vue'
import FeaturedNews from '@/components/FeaturedNews.vue'
import TestimonivesSlider from '@/components/TestimonivesSlider.vue'
</script>

<style scoped lang="scss">
.front-page {
  &__search {
    padding: var(--space-6) var(--space-4);
    background: var(--color-surface);
  }
}
</style>