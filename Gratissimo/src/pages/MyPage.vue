<template>
  <main class="my-page">
    <header class="my-page__intro">
      <h1>Velkommen {{ account?.firstname }}</h1>
      <p>
        Rediger eller slet dine annoncer. Du kan også danne dig et overblik over de
        annoncer du har gemt som favorit, samt fjerne dem igen
      </p>
      <p class="my-page__links">
        <a @click.prevent="handleSignOut">Log ud</a>
      </p>
    </header>

    <TabNav class="my-page__userOptions" label="Min side" :items="userOptions" />

    <AlertMessage v-if="message" :tone="messageTone">{{ message }}</AlertMessage>
    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>
    <p v-else-if="loading" class="my-page__status">Henter...</p>
    <p v-else-if="!items.length" class="my-page__status">{{ emptyText }}</p>

    <ul v-else class="my-page__list">
      <li v-for="job in pageItems">
        <article class="job">
          <div>
            <p class="job__org">{{ job.organization }}</p>
            <h2 class="job__title">{{ job.title }}</h2>
            <p>{{ job.description }}</p>

            <template v-if="isOpen(job)">
              <p>Adresse: {{ job.address }}, {{ job.zipcode }} {{ job.city }}</p>
              <p>Arbejdstid: {{ job.workType.type }}</p>
              <p>Hjemmearbejde:{{ job.workHome }}</p>
            </template>
          </div>

          <div class="job__side">
            <p>Lokation: <span class="job__highlighted">{{ job.city }}</span></p>
            <p>Indrykket: <span class="job__highlighted">{{ shortDate(job.createdAt) }}</span></p>

            <p class="job__actions">
              <Button v-if="showsFavorites" @click="removeFavorite(job)">Fjern</Button>
              <Button v-else @click="removeListing(job)">Slet</Button>
              <Button @click="toggle(job)">{{ isOpen(job) ? 'Luk' : 'Åben' }}</Button>
            </p>
          </div>
        </article>
      </li>
    </ul>

    <Pagination :page="page" :page-count="pageCount" @page-change="goToPage" />
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertMessage, Button, Pagination, TabNav } from '@/kit'
import { deleteFavorite, getFavorites, getJobListings, deleteJobListing } from '@/api'
import { account, signOut } from '@/auth'

const jobs_per_page = 5

const route = useRoute()
const router = useRouter()

const myJobListings = ref([])
const favorites = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')
const messageTone = ref('info')

const userOptions = [
  { label: 'Mine annoncer', to: '/min-side' },
  { label: 'Mine favoritter', to: '/min-side/favoritter' }
]

// Check if we should show the favorites by checking the url
const showsFavorites = computed(() => route.path === '/min-side/favoritter')

// Save the favorite job's id so we can use it to delete it if user requests it
const items = computed(() =>
  showsFavorites.value
    ? favorites.value.map((favorite) => ({ ...favorite.jobListing, favoriteId: favorite.id }))
    : myJobListings.value
)

const emptyText = computed(() =>
  showsFavorites.value
    ? 'Du har ikke gemt nogen annoncer endnu.'
    : 'Du har ikke oprettet nogen annoncer endnu.'
)

const pageCount = computed(() => Math.max(1, Math.ceil(items.value.length / jobs_per_page)))
const page = computed(() => Math.min(Number(route.query.side ?? 1), pageCount.value))

const pageItems = computed(() => {
  const start = (page.value - 1) * jobs_per_page
  return items.value.slice(start, start + jobs_per_page)
})

const goToPage = (next) => router.push({ query: { ...route.query, side: next } })

// check which job's id to open if openId is null all are closed
const openId = ref(null)

const isOpen = (job) => openId.value === job.id
const toggle = (job) => (openId.value = isOpen(job) ? null : job.id)

const shortDate = (value) => {
  const date = new Date(value)
  return `d. ${date.getDate()}/${date.getMonth() + 1}-${String(date.getFullYear()).slice(2)}`
}

async function removeFavorite(job) {
  try {
    await deleteFavorite(job.favoriteId)
    favorites.value = favorites.value.filter((item) => item.id !== job.favoriteId)

    messageTone.value = 'success'
    message.value = `"${job.title}" er fjernet fra dine favoritter.`
  } catch (err) {
    messageTone.value = 'error'
    message.value = err.message
  }
}

async function removeListing(job) {
  try {
    await deleteJobListing(job.id)
    myJobListings.value = myJobListings.value.filter((item) => item.id !== job.id)
    messageTone.value = 'success'
    message.value = `"${job.title}" er slettet.`
  } catch (err) {
    messageTone.value = 'error'
    message.value = err.message
  }
}

async function handleSignOut() {
  await signOut()
  router.push('/log-ind')
}

onMounted(async () => {
  try {
    // The API has no my-listings endpoint so we fetch all and then filter with the userId
    const allJobs = await getJobListings()
    myJobListings.value = allJobs.filter((job) => job.userId === account.value.id)
    favorites.value = await getFavorites()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.my-page {
  &__intro {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--space-6) var(--space-4);
    background: var(--color-surface);
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: var(--space-10);

    h1 {
      margin: 0 0 var(--space-4);
      font-size: var(--font-size-2xl);
      font-weight: 400;
      margin-bottom: var(--space-7)
    }

    p {
      max-width: var(--space-11);
      margin: 0 auto;
      font-weight: 200;
    }

  }

  &__links {
    position: absolute;
    right: var(--space-6);
    bottom: var(--space-5);
    gap: var(--space-5);
    max-width: var(--width-content-wide);
    margin: var(--space-5) auto 0;

    a {
      color: var(--color-accent-dark);
    }
  }

  &__userOptions {
    justify-content: center;
    margin: var(--space-6) auto;

    :deep(.tab-nav__list) {
      width: 50%;
      gap: 0;
      border: 1px solid var(--color-border-soft);
      border-radius: var(--radius-pill);
      overflow: hidden;
    }

    :deep(.tab-nav__list li) {
      flex: 1;
    }

    :deep(.tab-nav__tab) {
      display: block;
      padding: var(--space-3) var(--space-4);
      background-color: var(--color-surface);
      color: var(--color-text);
      text-align: center;
    }

    :deep(.tab-nav__tab[aria-current='page']) {
      background-color: var(--color-accent-dark);
      color: var(--color-accent-text);
      text-decoration: underline;
    }
  }

  &__status {
    max-width: var(--width-content-wide);
    margin: var(--space-6) auto;
    padding: 0 var(--space-4);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: var(--width-content-wide);
    margin: var(--space-6) auto;
    padding: 0 var(--space-4);
    list-style: none;
  }
}

.job {
  display: flex;
  justify-content: space-between;
  gap: var(--space-5);
  padding: var(--space-5);
  background: var(--color-bg);
  border: var(--border);
  border-radius: var(--radius);

  &__org {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  &__side {
    flex-shrink: 0;
    font-size: var(--font-size-sm);
  }

  &__actions button{
    background-color: var(--color-accent);
    color: var(--color-accent-text);
    padding: var(--space-2) var(--space-4)
  }

    &__actions button:nth-of-type(2){
    background-color: var(--color-surface);
    color: var(--color-text);
    margin-left: var(--space-4);
    padding: var(--space-2) var(--space-5)
  }

    &__highlighted{
    font-weight:600
  }

}

@media (max-width: 40rem) {
  .job {
    flex-direction: column;
  }
}
</style>