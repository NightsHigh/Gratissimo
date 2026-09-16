<template>
  <section class="search">
    <h2>Søg frivilligt arbejde:</h2>

    <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>

    <form @submit.prevent="submit">
      <div class="search__field">
        <img class="search__icon" :src="searchIcon" alt="" aria-hidden="true">
        <input id="q" v-model="form.q" type="search" placeholder="Eks. cafémedhjælper...">
        <Button type="submit">Søg</Button>
      </div>

      <div class="search__filters">
        <span>Filtrer:</span>

        <select v-model="form.region" aria-label="Region">
          <option value="">Region</option>
          <option v-for="item in regions" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>

        <select v-model="form.kategori" aria-label="Kategori">
          <option value="">Kategorier</option>
          <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>

        <select v-model="form.arbejdstid" aria-label="Arbejdstid">
          <option value="">Arbejdstid</option>
          <option v-for="item in workTypes" :key="item.id" :value="item.id">{{ item.type }}</option>
        </select>

        <select v-model="form.periode" aria-label="Periode">
          <option value="">Periode</option>
          <option value="uge">Seneste uge</option>
          <option value="maaned">Seneste måned</option>
          <option value="aar">Seneste år</option>
        </select>

        <select v-model="form.hjemmearbejde" aria-label="Hjemmearbejde">
          <option value="">Hjemmearbejde</option>
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <button class="search__reset" type="button" @click="router.push('/jobs')">Nulstil</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertMessage, Button } from '@/kit'
import { getRegions, getJobCategories, getWorkTypes } from '@/api'
import searchIcon from '@/assets/icons/icons8-search-50.png'

const route = useRoute()
const router = useRouter()

const form = reactive({ q: '', region: '', kategori: '', arbejdstid: '', periode: '', hjemmearbejde: '' })

const regions = ref([])
const categories = ref([])
const workTypes = ref([])
const error = ref('')

watch(
  () => route.query,
  (query) => {
    form.q = query.q ?? ''
    form.region = query.region ?? ''
    form.kategori = query.kategori ?? ''
    form.arbejdstid = query.arbejdstid ?? ''
    form.periode = query.periode ?? ''
    form.hjemmearbejde = query.hjemmearbejde ?? ''
  },
  { immediate: true }
)

function submit() {
  const query = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ''))
  router.push({ path: '/jobs', query })
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

    &:focus-within {
      outline: 2px solid var(--color-accent-dark);
      outline-offset: 2px;
    }
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

    &:focus-visible {
      outline: none;
    }
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-4);
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