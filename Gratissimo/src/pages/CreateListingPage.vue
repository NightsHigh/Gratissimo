<template>
  <main class="create-listing">
    <header class="create-listing__intro">
      <h1>Opret en annonce og find frivillige til din forening</h1>
      <p>
        Gratissimo er gratis for alle. Frivillige, organisationer og foreninger. Du skaber det
        frivillige liv og vi formidler kontakten. Når du har fundet en frivillig til din forening,
        kan du blot fjerne annoncen igen ved at gå til din side.
      </p>
      <RouterLink to="/min-side">Gå til min side</RouterLink>
    </header>

    <AlertMessage v-if="!isLoggedIn" tone="info">
      Du skal være logget ind for at oprette en annonce.
      <RouterLink to="/log-ind">Log ind her</RouterLink>.
    </AlertMessage>

    <template v-else>
      <AlertMessage v-if="message" :tone="messageTone">{{ message }}</AlertMessage>

      <form class="create-listing__form" novalidate @submit.prevent="submit">
        <div class="create-listing__column">
          <p class="create-listing__field">
            <label for="title">Overskrift</label>
            <input id="title" v-model="form.title" placeholder="Eks. Mågejæger søges...">
          </p>

          <p class="create-listing__field">
            <label for="organization">Organisation / forening</label>
            <input id="organization" v-model="form.organization" placeholder="Skriv din forening her...">
          </p>

          <p class="create-listing__field">
            <label for="regionId">Lokation</label>
            <select id="regionId" v-model="form.regionId">
              <option value="">Vælg lokation...</option>
              <option v-for="item in regions" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </p>

          <p class="create-listing__field">
            <label for="jobCategoryId">Kategori</label>
            <select id="jobCategoryId" v-model="form.jobCategoryId">
              <option value="">Vælg kategori...</option>
              <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </p>

          <p class="create-listing__field">
            <label for="workTypeId">Arbejdstid</label>
            <select id="workTypeId" v-model="form.workTypeId">
              <option value="">Vælg arbejdstid...</option>
              <option v-for="item in workTypes" :key="item.id" :value="item.id">{{ item.type }}</option>
            </select>
          </p>

          <p class="create-listing__field">
            <label for="workHome">Hjemmearbejde</label>
            <select id="workHome" v-model="form.workHome">
              <option value="">Vælg hjemmearbejde...</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </p>

          <p class="create-listing__field">
            <label for="address">Adresse</label>
            <input id="address" v-model="form.address" placeholder="Eks. Holmegade 22, 1. sal">
          </p>

          <p class="create-listing__field">
            <label for="zipcode">Postnummer</label>
            <input id="zipcode" v-model="form.zipcode" placeholder="Eks. 9200">
          </p>

          <p class="create-listing__field">
            <label for="city">By</label>
            <input id="city" v-model="form.city" placeholder="Eks. Aalborg SV">
          </p>
        </div>

        <div class="create-listing__column">
          <p class="create-listing__field">
            <label for="description">Job beskrivelse</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="16"
              placeholder="Her kan du beskrive jobbet, hvilke erfaringer der kræves og hvad der forventes af den frivillige..."
            />
          </p>
          <div>
            <Button type="submit" :disabled="pending" class="create-listing__submit">Opret annonce</Button>
          </div>
        </div>
      </form>
    </template>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertMessage, Button } from '@/kit'
import { createJobListing, getJobCategories, getRegions, getWorkTypes } from '@/api'
import { account, isLoggedIn } from '@/auth'

const router = useRouter()

const form = ref({
  title: '',
  organization: '',
  regionId: '',
  jobCategoryId: '',
  workTypeId: '',
  workHome: '',
  address: '',
  zipcode: '',
  city: '',
  description: ''
})

const regions = ref([])
const categories = ref([])
const workTypes = ref([])

const message = ref('')
const messageTone = ref('info')
const pending = ref(false)

// API'et validerer ingenting, saa alt fanges her. Foerste fejl vinder.
function validate() {
  if (!form.value.title.trim()) return 'Skriv en overskrift.'
  if (!form.value.organization.trim()) return 'Skriv navnet på din organisation eller forening.'
  if (!form.value.regionId) return 'Vælg en lokation.'
  if (!form.value.jobCategoryId) return 'Vælg en kategori.'
  if (!form.value.workTypeId) return 'Vælg en arbejdstid.'
  if (!form.value.workHome) return 'Vælg om jobbet kan laves hjemmefra.'
  if (!form.value.address.trim()) return 'Skriv en adresse.'
  if (!/^\d{4}$/.test(form.value.zipcode.trim())) return 'Skriv et postnummer på 4 cifre.'
  if (!form.value.city.trim()) return 'Skriv en by.'
  if (!form.value.description.trim()) return 'Skriv en beskrivelse af jobbet.'

  return ''
}

async function submit() {
  message.value = validate()

  if (message.value) {
    messageTone.value = 'error'
    return
  }

  pending.value = true

  try {
    await createJobListing({ 
      ...form.value,
      userId: account.value.id })
  router.push('/min-side')

  } catch (err) {
    messageTone.value = 'error'
    message.value = err.message
  } finally {
    pending.value = false
  }
}

onMounted(async () => {
  try {
    regions.value = await getRegions()
    categories.value = await getJobCategories()
    workTypes.value = await getWorkTypes()
  } catch (err) {
    messageTone.value = 'error'
    message.value = err.message
  }
})
</script>

<style scoped lang="scss">
.create-listing {
  &__intro {
    display: flex;
    flex-direction: column;
    padding: var(--space-6) var(--space-4);
    background: var(--color-surface);
    text-align: center;
    align-items: center;
    justify-content: center;

    h1{
      font-weight: 400;
      font-size: var(--space-7)
    }

    p{
      width: 30%;
      align-items: center
    }

    a{
      color: var(--color-accent)
    }
  }

  &__form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: var(--space-6);
    max-width: var(--width-content);
    margin: var(--space-6) auto;
    padding: 0 var(--space-4);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin: 0 0 var(--space-3);


    textarea{
      height: 37.5vw;
      resize: none;
    }

    input,
    select,
    textarea {
      padding: var(--space-3);
      background: var(--color-surface);
      border: 1px solid var(--color-border-soft);
      border-radius: var(--radius);
      color: var(--color-text);
      font-weight: 100;
    }

    // a bit off on the color but works for now - 
    // Make the select option aka 1st option of the select the same color as the other placeholders
    select[id="regionId"], [id="jobCategoryId"], [id="workTypeId"], [id="workHome"], option:first-child {
      color: var(--color-text-faint);
      font-weight: 200;
    }
  }

  &__column{
    div{
      display: flex
    }
    button{
      margin: var(--space-4) 0rem var(--space-6) auto
    }
  }
}
@media (max-width: 700px) {
  .create-listing{
    &__intro{
      h1{
        font-size: var(--space-6)
      }
      p{
        width: 80%;
        align-items: center
      }
    }
  }
  
}
</style>