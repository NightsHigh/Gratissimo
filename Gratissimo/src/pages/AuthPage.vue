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
        <p class="auth__field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Skriv din email..."
          >
        </p>

        <p class="auth__field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Skriv dit password..."
          >
        </p>

        <template v-if="isSignup">
          <p class="auth__field">
            <label for="repeatPassword">Gentag password</label>
            <input
              id="repeatPassword"
              v-model="repeatPassword"
              type="password"
              placeholder="Skriv dit password..."
            >
          </p>

          <p class="auth__field">
            <label for="firstname">Fornavn</label>
            <input
              id="firstname"
              v-model="firstname"
              type="text"
              placeholder="Skriv dit fornavn..."
            >
          </p>

          <p class="auth__field">
            <label for="lastname">Efternavn</label>
            <input
              id="lastname"
              v-model="lastname"
              type="text"
              placeholder="Skriv dit efternavn..."
            >
          </p>

          <p class="auth__field">
            <label for="phone">Telefon nummer</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              placeholder="Skriv dit telefon nummer..."
            >
          </p>

          <p class="auth__field">
            <label for="zipcode">Post nummer</label>
            <input
              id="zipcode"
              v-model="zipcode"
              type="number"
              placeholder="Skriv dit post nummer..."
            >
          </p>
        </template>

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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertMessage, Button } from '@/kit'
import { signIn, signUp } from '@/auth'

const route = useRoute()
const router = useRouter()

const isSignup = computed(() => route.path === '/opret-profil')

const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const firstname = ref('')
const lastname = ref('')
const phone = ref('')
const zipcode = ref('')

const error = ref('')
const pending = ref(false)

const EMAIL_REGEX = /^^(?!\.)(?!.*\.\.)(?!.*\.@)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!-)[a-zA-Z0-9-]+(?<!-)(?:\.[a-zA-Z0-9-]+(?<!-))*\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^[A-Za-z\d!@#$%^&*(),.?":{}|<>_\-\[\]\\\/+=~';]{8,64}$/
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/
const ZIPCODE_REGEX = /^\d{4}(?:-\d{4})?$/
const NAME_REGEX = /^.{2,32}$/

function validate() {
  switch (true) {
    case !isSignup.value:
      return ''

    case !EMAIL_REGEX.test(email.value):
      return 'Skriv en gyldig email.'

    case !PASSWORD_REGEX.test(password.value):
      return 'Password skal være mindst 8 tegn og maks 64 tegn uden mellemrum.'

    case password.value !== repeatPassword.value:
      return 'De to passwords er ikke ens.'

    case !NAME_REGEX.test(firstname.value):
      return 'Skriv dit fornavn.'

    case !NAME_REGEX.test(lastname.value):
      return 'Skriv dit efternavn.'

    case !PHONE_REGEX.test(phone.value):
      return 'Skriv dit telefonnummer.'

    case !ZIPCODE_REGEX.test(zipcode.value):
      return 'Skriv et gyldigt postnummer på 4 cifre.'

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
      await signUp({
        email: email.value,
        password: password.value,
        firstname: firstname.value,
        lastname: lastname.value,
        phone: phone.value,
        zipcode: zipcode.value
      })
    } else {
      await signIn(email.value, password.value)
    }
// TODO Add error catching on the vue router TODO
    router.push('/min-side')
  } catch (err) {
    error.value = err.message
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