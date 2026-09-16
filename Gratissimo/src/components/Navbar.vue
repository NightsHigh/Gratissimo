<template>
  <nav class="navbar" aria-label="Main navigation">
    <TabNav :items="navbarItems" />

    <ul class="navbar__actions">
      <li>
        <RouterLink
          :to="isLoggedIn ? '/min-side' : '/opret-profil'"
          class="navbar__button navbar__opret-profil"
        >
          {{ isLoggedIn ? 'Min side' : 'Opret profil' }}
        </RouterLink>
      </li>

      <span class="navbar__divider"></span>

      <li>
        <RouterLink v-if="!isLoggedIn" to="/log-ind" class="navbar__button navbar__Login">
          Log ind
        </RouterLink>
        <button v-else type="button" class="navbar__button navbar__Login" @click="handleSignOut">
          Log ud
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { TabNav } from '@/kit'
import { RouterLink, useRouter } from 'vue-router'
import { isLoggedIn, signOut } from '@/auth'

const router = useRouter()

async function handleSignOut() {
  await signOut()
  router.push('/log-ind')
}

const navbarItems = [
  { label: 'Alle Jobs', to: '/jobs' },
  { label: 'Opret annonce', to: '/opret-annonce' },
  { label: 'Nyheder', to: '/nyheder' }
]
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-accent-dark);
  padding: var(--space-3) var(--space-8);

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__divider {
    display: inline-block;
    width: 1px;
    height: 1.5rem;
    background: var(--color-bg);
  }

  &__button {
    display: inline-block;
    background: none;
    font: inherit;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    color: var(--color-bg);
    text-decoration: none;
    border: none;
  }

  &__Login{
    padding-left: 0;
    padding-right: var(--space-4);
  }

  &__opret-profil{
    padding-left: 0;
    padding-right: 0;
  }
}
</style>