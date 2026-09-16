import { computed, ref } from 'vue'
import { createUser, login, logout, verifySession } from './api.js'

export const account = ref(null)

export const isLoggedIn = computed(() => account.value !== null)

export async function signIn(email, password) {
  account.value = await login(email, password)
}

export async function signUp(user) {
  // The API does not answer with tokens when creating a user, so we sign in after.
  await createUser(user)
  await signIn(user.email, user.password)
}

export async function signOut() {
  await logout()
  account.value = null
}

export async function restoreSession() {
  try {
    account.value = await verifySession()
  } catch {
    await signOut()
  }
}