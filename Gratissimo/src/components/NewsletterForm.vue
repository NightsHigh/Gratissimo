<template>
  <form class="newsletter" novalidate @submit.prevent="submit">

    <div class="newsletter__field">
      <span class="newsletter__at" aria-hidden="true">@</span>
      <input
        id="newsletter-email"
        v-model="email"
        class="newsletter__input"
        type="email"
        placeholder="Indtast email..."
        autocomplete="email"
        :aria-invalid="tone === 'error' || undefined"
      >
      <button class="newsletter__button" type="submit" :disabled="pending">
        {{ pending ? 'Sender...' : 'Tilmeld' }}
      </button>
    </div>

    <AlertMessage v-if="message" :tone="tone" class="newsletter__message">
      {{ message }}
    </AlertMessage>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { AlertMessage } from '@/kit'
import { subscribeNewsletter } from '@/api'

const email = ref('')
const message = ref('')
const tone = ref('info')
const pending = ref(false)

// Validate email for obvious mistakes
const EmailRegex = (value) => /^(?!\.)(?!.*\.\.)(?!.*\.@)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!-)[a-zA-Z0-9-]+(?<!-)(?:\.[a-zA-Z0-9-]+(?<!-))*\.[a-zA-Z]{2,}$/.test(value)

async function submit() {
  const value = email.value.trim()

  if (!value) {
    tone.value = 'error'
    message.value = 'Skriv din email for at tilmelde dig.'
    return
  }

  if (!EmailRegex(value)) {
    tone.value = 'error'
    message.value = 'Det ligner ikke en gyldig email. Tjek den lige igen.'
    return
  }

  pending.value = true
  message.value = ''

  try {
    await subscribeNewsletter(value)
    tone.value = 'success'
    message.value = 'Du er nu tilmeldt nyhedsbrevet'
    email.value = ''
  } catch (error) {

    // omskriv fejlbesked til dansk fra api'ets engelske fejlbesked
    const alreadySubscribed = error.message === 'Email already exists'
    tone.value = alreadySubscribed ? 'info' : 'error'
    message.value = alreadySubscribed
      ? 'Du er allerede tilmeldt nyhedsbrevet.'
      : error.message
  } finally {
    pending.value = false
  }
}
</script>

<style scoped lang="scss">
.newsletter {
  &__field {
    display: flex;
    align-items: center;
    max-width: 20rem;
    background: var(--color-surface);
    border-radius: var(--radius-pill);
    overflow: hidden;
  }

  &__at {
    padding-left: var(--space-3);
    color: var(--color-text-faint);
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: var(--space-2);
    border: 0;
    background: none;
    color: var(--color-text);
    &::placeholder {
      color: var(--color-text-faint);
    }

    &:focus-visible {
    outline: none;
  }
  }
  
  &__button {
    padding: var(--space-2) var(--space-4);
    border: 0;
    border-radius: var(--radius-pill);
    background: var(--color-accent-dark);
    color: var(--color-accent-text);
    cursor: pointer;

    &:disabled {
      opacity: 0.7;
    }
  }

  &__message {
    margin-top: var(--space-3);
    max-width: 21rem;
  }
}
</style>