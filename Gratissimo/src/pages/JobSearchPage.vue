<template>
  <main class="jobs">
    <div class="jobs__search">
      <Search />
    </div>

    <AlertMessage v-if="message" :tone="messageTone">{{ message }}</AlertMessage>
    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>
    <p v-else-if="loading">Henter jobs...</p>
    <p v-else-if="!matches.length">Ingen jobs matcher din søgning.</p>

    <ul v-else class="jobs__list">
      <li v-for="job in pageItems" :key="job.id">
        <article class="job">
          <div>
            <p class="job__org">{{ job.organization }}</p>
            <h3 class="job__title">{{ job.title }}</h3>
            <p v-if="isOpen(job)" class="job__category">{{ job.jobCategory?.name }}</p>

            <h4 v-if="isOpen(job)">Beskrivelse</h4>
            <p>{{ job.description }}</p>

            <h4 v-if="isOpen(job)">Erfaring</h4>
            <p v-if="isOpen(job)">{{ placeholder_Text }}</p>

            <h4 v-if="isOpen(job)">Arbejdsopgaver</h4>
            <p v-if="isOpen(job)">{{ placeholder_Text }}</p>
            
            <template v-if="isOpen(job)">
            </template>
          </div>

          <div class="job__side">
            <p>Lokation: <strong>{{ job.city }}</strong></p>
            <p>Indrykket: <strong>{{ shortDate(job.createdAt) }}</strong></p>

            <template v-if="isOpen(job)">
              <p>Arbejdstid: <strong>{{ job.workType?.type }}</strong></p>
              <p>Hjemmearbejde: <strong>{{ job.workHome }}</strong></p>

              <h4 class="job__contact">Kontakt</h4>
              <div class="job__combine">
                <p>{{ job.organization }}</p>
                <p>{{ job.address }}, {{ job.zipcode }} {{ job.city }}</p>
                <p>Tlf: {{ job.user?.phone }}</p>
                <p>Email: {{ job.user?.email }}</p>
              </div>

              <p>Att: {{ job.user?.firstname }} {{ job.user?.lastname }}</p>
            </template>

            <p class="job__actions">
              <Button @click="toggleFavorite(job)">
                <template v-if="isFavorited(job)">
                  Fjern
                  <img :src="filledHeart" alt="Et rødt hjerte" class="jobs__hearts" />
                </template>

                <template v-else>
                  Gem
                  <img :src="emptyHeart" alt="Et tomt hjerte" class="jobs__hearts" />
                </template>
              </Button>

              <Button class="job__buttons" v-if="isOpen(job)" @click="close">Luk</Button>
              <Button v-else @click="open(job)">Åben</Button>
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
import Search from '@/components/Search.vue'
import { AlertMessage, Button, Pagination } from '@/kit'
import { createFavorite, deleteFavorite, getFavorites, getJobListings } from '@/api'
import { isLoggedIn } from '@/auth'
import emptyHeart from '@/assets/icons/icons8-favorite-50.png'
import filledHeart from '@/assets/icons/icons8-favorite-filled-50.png'

const placeholder_Text = `
Lorem ipsum, Lorem ipsum Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem 
ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum
ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum
`
const PER_PAGE = 5

const route = useRoute()
const router = useRouter()

const jobs = ref([])
const favorites = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')
const messageTone = ref('info')

const shortDate = (value) => {
  const date = new Date(value)
  return `d. ${date.getDate()}/${date.getMonth() + 1}-${String(date.getFullYear()).slice(2)}`
}

function periodStart(periode) {
  if (!periode) return null

  const date = new Date()
  if (periode === 'uge') date.setDate(date.getDate() - 7)
  else if (periode === 'maaned') date.setMonth(date.getMonth() - 1)
  else if (periode === 'aar') date.setFullYear(date.getFullYear() - 1)

  return date
}

const matches = computed(() => {
  const text = (route.query.q ?? '').toLowerCase()
  const since = periodStart(route.query.periode)

  return jobs.value.filter((job) => {
    if (text && !`${job.title} ${job.description}`.toLowerCase().includes(text)) return false
    if (route.query.region && job.regionId !== Number(route.query.region)) return false
    if (route.query.kategori && job.jobCategoryId !== Number(route.query.kategori)) return false
    if (route.query.arbejdstid && job.workTypeId !== Number(route.query.arbejdstid)) return false
    if (route.query.hjemmearbejde && job.workHome !== route.query.hjemmearbejde) return false
    if (since && new Date(job.createdAt) < since) return false
    return true
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(matches.value.length / PER_PAGE)))
const page = computed(() => Math.min(Number(route.query.side ?? 1), pageCount.value))

const pageItems = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return matches.value.slice(start, start + PER_PAGE)
})

const favoriteFor = (job) => favorites.value.find((item) => item.jobListingId === job.id)
const isFavorited = (job) => Boolean(favoriteFor(job))

async function toggleFavorite(job) {
  if (!isLoggedIn.value) {
    messageTone.value = 'info'
    message.value = 'Du skal være logget ind for at gemme et job.'
    return
  }

  try {
    const existing = favoriteFor(job)

    if (existing) {
      await deleteFavorite(existing.id)
      favorites.value = favorites.value.filter((item) => item.id !== existing.id)
      message.value = ''
    } else {
      favorites.value.push(await createFavorite(job.id))
      messageTone.value = 'success'
      message.value = `"${job.title}" er gemt under dine favoritter.`
    }
  } catch (err) {
    messageTone.value = 'error'
    message.value = err.message
  }
}


const openId = ref(null)
const isOpen = (job) => openId.value === job.id
const open = (job) => (openId.value = job.id)
const close = () => (openId.value = null)
const goToPage = (next) => router.push({ query: { ...route.query, side: next } })

onMounted(async () => {
  try {
    jobs.value = await getJobListings()
    if (isLoggedIn.value) favorites.value = await getFavorites()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.jobs {
  &__search {
    padding: var(--space-6) var(--space-4);
    background: var(--color-surface);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: var(--width-content);
    margin: var(--space-6) auto;
    padding: 0;
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

  &__title {
    margin: var(--space-2) 0;
  }

  &__side {
    flex-shrink: 0;
    font-size: var(--font-size-sm);
  }

  &__combine p{
    margin: 0;
  }

  &__actions button{
    background-color: var(--color-surface);
    color: var(--color-text);
    padding: var(--space-2) var(--space-4)
  }

    &__actions button:nth-of-type(2){
    margin-left: var(--space-4);
    padding: var(--space-2) var(--space-5)
  }

  &__actions img{
  width: var(--space-4)
}
}
@media (max-width: 700px) {
  .job{
    width: 90vw;
    margin: auto
  }
}
</style>