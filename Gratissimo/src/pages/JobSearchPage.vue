<template>
  <main class="jobs">
    <div class="jobs__search">
      <Search />
    </div>

    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>
    <p v-else-if="loading">Henter jobs...</p>
    <p v-else-if="!matches.length">Ingen jobs matcher din søgning.</p>

    <ul v-else class="jobs__list">
      <li v-for="job in pageItems" :key="job.id">
        <article class="job">
          <div>
            <p class="job__org">{{ job.organization }}</p>
            <h3 class="job__title">{{ job.title }}</h3>
            <p>{{ job.description }}</p>
          </div>

          <div class="job__side">
            <p>Lokation: <strong>{{ job.city }}</strong></p>
            <p>Indrykket: <strong>{{ shortDate(job.createdAt) }}</strong></p>
            <p>Arbejdstid: <strong>{{ job.workType?.type }}</strong></p>
            <p>Hjemmearbejde: <strong>{{ job.workHome }}</strong></p>
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
import { AlertMessage, Pagination } from '@/kit'
import { getJobListings } from '@/api'

const PER_PAGE = 5

const route = useRoute()
const router = useRouter()

const jobs = ref([])
const loading = ref(true)
const error = ref('')

const shortDate = (value) => {
  const date = new Date(value)
  return `d. ${date.getDate()}/${date.getMonth() + 1}-${String(date.getFullYear()).slice(2)}`
}

// Periode-filteret regner baglaens fra i dag.
function periodStart(periode) {
  if (!periode) return null

  const date = new Date()
  if (periode === 'uge') date.setDate(date.getDate() - 7)
  if (periode === 'maaned') date.setMonth(date.getMonth() - 1)
  if (periode === 'aar') date.setFullYear(date.getFullYear() - 1)

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

function goToPage(next) {
  if (next < 1 || next > pageCount.value) return
  router.push({ query: { ...route.query, side: next } })
}

onMounted(async () => {
  try {
    jobs.value = await getJobListings()
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
}
</style>