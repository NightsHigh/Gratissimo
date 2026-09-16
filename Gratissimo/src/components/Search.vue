<template>
  <section class="search">
    <h2>Søg frivilligt arbejde:</h2>

    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>

    <form @submit.prevent="submit">
      <div class="search__field">
        <img class="search__icon" :src="searchIcon" alt="" aria-hidden="true">
        <input
          id="q"
          v-model="q"
          type="search"
          placeholder="Eks. cafémedhjælper..."
        >
        <Button type="submit">Søg</Button>
      </div>

      <div class="search__filters">
        <div>

          <span>Filtrer:</span>
  
          <select v-model="region" aria-label="Region">
            <option value="">Region</option>
            <option v-for="item in regions" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
  
          <select v-model="kategori" aria-label="Kategori">
            <option value="">Kategorier</option>
            <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
  
          <select v-model="arbejdstid" aria-label="Arbejdstid">
            <option value="">Arbejdstid</option>
            <option v-for="item in workTypes" :key="item.id" :value="item.id">{{ item.type }}</option>
          </select>
  
          <select v-model="periode" aria-label="Periode">
            <option value="">Periode</option>
            <option value="uge">Seneste uge</option>
            <option value="maaned">Seneste måned</option>
            <option value="aar">Seneste år</option>
          </select>
  
          <select v-model="hjemmearbejde" aria-label="Hjemmearbejde">
            <option value="">Hjemmearbejde</option>
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>

           <button class="search__reset" type="button" @click=reset()>Nulstil</button>
        </div>

      </div>
    </form>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertMessage, Button } from '@/kit'
import { getRegions, getJobCategories, getWorkTypes } from '@/api'
import searchIcon from '@/assets/icons/icons8-search-50.png'

const route = useRoute()
const router = useRouter()

const q = ref('')
const region = ref('')
const kategori = ref('')
const arbejdstid = ref('')
const periode = ref('')
const hjemmearbejde = ref('')

const regions = ref([])
const categories = ref([])
const workTypes = ref([])
const error = ref('')

onMounted(() => {
  q.value = route.query.q ?? ''
  region.value = route.query.region ?? ''
  kategori.value = route.query.kategori ?? ''
  arbejdstid.value = route.query.arbejdstid ?? ''
  periode.value = route.query.periode ?? ''
  hjemmearbejde.value = route.query.hjemmearbejde ?? ''
})

function reset() {
  q.value = ''
  region.value = ''
  kategori.value = ''
  arbejdstid.value = ''
  periode.value = ''
  hjemmearbejde.value = ''

  router.push('/jobs')
}

function submit() {
  const query = {}

  if (q.value) query.q = q.value
  if (region.value) query.region = region.value
  if (kategori.value) query.kategori = kategori.value
  if (arbejdstid.value) query.arbejdstid = arbejdstid.value
  if (periode.value) query.periode = periode.value
  if (hjemmearbejde.value) query.hjemmearbejde = hjemmearbejde.value

  router.push({
    path: '/jobs',
    query
  })
}

onMounted(async () => {
  try {
    ;[regions.value, categories.value, workTypes.value] = await Promise.all([
      getRegions(),
      getJobCategories(),
      getWorkTypes()
    ])
  } catch (err) {
    error.value = err.message
  }
})
</script>


<style scoped lang="scss">
.search {
  max-width: var(--width-content);
  margin: 0 auto;

  h2 {
    font-size: var(--font-size-xl);
    font-weight: 400;
  }

  &__field {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding-left: var(--space-4);
    background: var(--color-bg);
    border-radius: var(--radius-pill);
    overflow: hidden;
  }

  &__icon {
    width: 1.25rem;
  }

  input {
    flex: 1;
    min-width: 0;
    padding: var(--space-4) 0;
    border: 0;
    background: none;
    font: inherit;
  }

  &__filters{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-4);

    div{
      display: flex;
      margin-left: auto;
      margin-right: auto;
      gap: var(--space-4);
      align-items: center
    }
  }

  select {
    padding: var(--space-2) var(--space-3);
    background: var(--color-bg);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-pill);
    font: inherit;
  }

  &__reset {
    border: 0;
    background: none;
    font: inherit;
    cursor: pointer;
  }
}
</style>