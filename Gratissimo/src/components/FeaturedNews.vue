<template>
  <section class="featured-news">
    <h2>Udvalgte Nyheder</h2>

    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>

    <ul class="featured-news__list">
      <li v-for="article in articles" :key="article.id">
        <RouterLink :to="`/nyheder/${article.id}`">
          <Card :title="article.title">
            <template v-if="article.imageUrl" #image>
              <img class="featured-news__image" :src="imageUrl(article.imageUrl)" alt="">
            </template>
            <template #meta>
              <span class="featured-news__meta">
                d. {{ shortDate(article.createdAt) }} - {{ article.author }}
              </span>
            </template>
          </Card>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { AlertMessage, Card } from '@/kit'
import { getArticles, imageUrl } from '@/api'

const articles = ref([])
const error = ref('')

// Designet viser datoen som "22/3".
const shortDate = (value) => {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

onMounted(async () => {
  try {
    const allArticles = await getArticles()
    articles.value = allArticles.sort(() => Math.random() - 0.5).slice(0, 3)
  } catch (err) {
    error.value = err.message
  }
})
</script>

<style scoped lang="scss">
.featured-news {
  padding: var(--space-6);
  background: var(--color-surface);

  a {
    color: inherit;
    text-decoration: none;
  }

  h2 {
    max-width: var(--width-content);
    margin: 0 auto var(--space-5);
    font-size: var(--font-size-lg);
    font-weight: 400;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
    max-width: var(--width-content);
    margin: 0 auto;
    padding: 0;
    list-style: none;
  }

  &__image {
    aspect-ratio: 3 / 2;
    object-fit: cover;
  }

  &__meta {
    color: var(--color-accent-dark);
  }
}
</style>