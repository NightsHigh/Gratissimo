<template>
  <main class="news">
    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>
    <p v-else-if="loading">Henter nyheder...</p>
    <AlertMessage v-else-if="!article" tone="info">Nyheden findes ikke.</AlertMessage>

    <article v-else class="news__article">
      <img v-if="article.imageUrl" class="news__image" :src="imageUrl(article.imageUrl)" alt="{{ article.title }}">

      <div class="news__body">
        <h1>{{ article.title }}</h1>
        <p class="news__meta">d. {{ shortDate(article.createdAt) }} af {{ article.author }}</p>

        <p v-for="(paragraph) in paragraphs">{{ paragraph }}</p>
      </div>
    </article>

    <FeaturedNews title="Alle Nyheder" />
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FeaturedNews from '@/components/FeaturedNews.vue'
import { AlertMessage } from '@/kit'
import { getArticles, imageUrl } from '@/api'

const route = useRoute()

const articles = ref([])
const loading = ref(true)
const error = ref('')
const randomId = ref(null) // Choose which random news to show to the user if they enter without an id in the search params


// Show a randoms news at the top if the user goes to the site without a search id param
const article = computed(() => {
  const id = route.params.id ? Number(route.params.id) : randomId.value 

  return articles.value.find((item) => item.id === id)
})

const paragraphs = computed(() => (article.value?.content ?? '').split('\n\n'))

const shortDate = (value) => {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

onMounted(async () => {
  try {
    articles.value = await getArticles()

    const random = articles.value[Math.floor(Math.random() * articles.value.length)]
    randomId.value = random.id
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.news {
  &__image {
    width: 100%;
    aspect-ratio: 3 / 1;
    object-fit: cover;
  }

  &__body {
    margin: 0 auto;
    padding: var(--space-6) var(--space-4);
  }
}
</style>