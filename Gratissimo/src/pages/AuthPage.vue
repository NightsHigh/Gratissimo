<template>
  <main class="auth">
    <header class="auth__intro">
      <h1>Log ind eller opret dig som bruger</h1>
      <p>
        Når du opretter en profil på Gratissimo får du adgang til at oprette, slette og
        redigere i job annoncer. Som privatperson får du mulighed for at gemme de jobs
        du kunne være interesseret i.
      </p>
      <RouterLink to="/log-ind">Log ind for at gå til min side</RouterLink>
    </header>

    <section class="auth__form">
      <h2>{{ isSignup ? 'Opret ny profil' : 'Log ind' }}</h2>

      <AlertMessage v-if="error" tone="error">{{ error }}</AlertMessage>

      <form novalidate @submit.prevent="submit">
        <p v-for="field in fields" :key="field.name" class="auth__field">
          <label :for="field.name">{{ field.label }}</label>
          <input
            :id="field.name"
            v-model="form[field.name]"
            :type="field.type"
            :placeholder="field.placeholder"
          >
        </p>

        <Button type="submit" :disabled="pending">
          {{ isSignup ? 'Opret profil' : 'Log ind' }}
        </Button>
      </form>

      <RouterLink :to="isSignup ? '/log-ind' : '/opret-profil'">
        {{ isSignup ? 'Log ind' : 'Opret bruger' }}
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertMessage, Button } from '@/kit'
import { signIn, signUp } from '@/auth'

const route = useRoute()
const router = useRouter()

const isSignup = computed(() => route.path === '/opret-profil')

const LOGIN_FIELDS = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Skriv din email...' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Skriv dit password...' }
]

const SIGNUP_FIELDS = [
  ...LOGIN_FIELDS,
  { name: 'repeatPassword', label: 'Gentag password', type: 'password', placeholder: 'Skriv dit password...' },
  { name: 'firstname', label: 'Fornavn', type: 'text', placeholder: 'Skriv dit fornavn...' },
  { name: 'lastname', label: 'Efternavn', type: 'text', placeholder: 'Skriv dit efternavn...' },
  { name: 'phone', label: 'Telefon nummer', type: 'tel', placeholder: 'Skriv dit telefon nummer...' },
  { name: 'zipcode', label: 'Post nummer', type: 'number', placeholder: 'Skriv dit post nummer...' }
]

const fields = computed(() => (isSignup.value ? SIGNUP_FIELDS : LOGIN_FIELDS))
const error = ref('')
const pending = ref(false)

const EMAIL_REGEX = /^^(?!\.)(?!.*\.\.)(?!.*\.@)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!-)[a-zA-Z0-9-]+(?<!-)(?:\.[a-zA-Z0-9-]+(?<!-))*\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^[A-Za-z\d!@#$%^&*(),.?":{}|<>_\-\[\]\\\/+=~';]{8,64}$/
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/
const ZIPCODE_REGEX = /^\d{4}(?:-\d{4})?$/
const NAME_REGEX = /^.{2,32}$/
const form = reactive({
  email: '',
  password: '',
  repeatPassword: '',
  firstname: '',
  lastname: '',
  phone: '',
  zipcode: ''
})

function validate() {
  switch (true) {
    case (!isSignup.value):
      return ''
      
    case !EMAIL_REGEX.test(form.email):
      return 'Skriv en gyldig email.'

    case !PASSWORD_REGEX.test(form.password):
      return `
      Password skal være mindst 8 tegn og maks 64 tegn uden mellemrum.`

    case form.password !== form.repeatPassword:
      return 'De to passwords er ikke ens.'

    case !NAME_REGEX.test(form.firstname):
      return 'Skriv dit fornavn.'

    case !NAME_REGEX.test(form.lastname):
      return 'Skriv dit efternavn.'

    case !PHONE_REGEX.test(form.phone):
      return 'Skriv dit telefonnummer på 8 cifre.'

    case !ZIPCODE_REGEX.test(form.zipcode):
      return 'Skriv et gyldigt post nummer på 4 cifre'

    default:
      return ''
  }
}



async function submit() {
  error.value = validate()
  if (error.value) return

  pending.value = true

  try {
    if (isSignup.value) {
      const { repeatPassword, ...user } = form
      await signUp(user)
    } else {
      await signIn(form.email, form.password)
    }

    router.push('/min-side')
  } catch (error) {
    error.value = error.message
  } finally {
    pending.value = false
  }
}
</script>

<style scoped lang="scss">
.auth {
  text-align: center;

  a {
    color: var(--color-accent-dark);
  }

  &__intro {
    padding: var(--space-6) var(--space-4);
    background: var(--color-surface);

    p {
      max-width: 34rem;
      margin: var(--space-4) auto;
    }
  }

  &__form {
    max-width: 22rem;
    margin: var(--space-6) auto;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin: 0 0 var(--space-3);
    text-align: left;

    input {
      padding: var(--space-3);
      background: var(--color-surface);
      border: 1px solid var(--color-border-soft);
      border-radius: var(--radius);
      font: inherit;
    }
  }

  :deep(.button) {
    justify-content: center;
    width: 100%;
    margin-bottom: var(--space-4);
  }
}
</style>