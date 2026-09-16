const API_BASE = import.meta.env.VITE_API_URL

const ACCESS_TOKEN = 'gratissimo_access'
const REFRESH_TOKEN = 'gratissimo_refresh'

// max-age counts in seconds, so 60 seconds * 60 minutes is one hour & refresh is 60 seconds * 60 minutes * 24 is 24 hours.
const ACCESS_LIFETIME_IN_SECONDS = 60 * 60
const REFRESH_LIFETIME_IN_SECONDS = 60 * 60 * 24

function readCookie(name) {
  const cookies = document.cookie.split('; ')

  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')

    if (key === name) return value
  }

  return ''
}

function saveCookie(name, value, lifetime) {
  document.cookie = `${name}=${value}; path=/; max-age=${lifetime}`
}

function forgetCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`
}

async function readBody(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) return response.json()

  return response.text()
}

async function request(path, options = {}) {
  const method = options.method || 'GET'
  const body = options.body
  const needsLogin = options.needsLogin || false
  const settings = { method, headers: {} }

  if (body) {
    settings.headers['Content-Type'] = 'application/json'
    settings.body = JSON.stringify(body)
  }

  if (needsLogin) {
    const token = readCookie(ACCESS_TOKEN)

    if (!token) throw new Error('Du skal være logget ind for at gøre det.')

    settings.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE}/api${path}`, settings)
    const answer = await readBody(response)

    // The API sends its own message as { error: "..." }, so use that when it is there.
    if (!response.ok) {
      throw new Error(answer?.error || `Gratissimo API'et fejlede på ${path} (HTTP ${response.status}).`)
    }

    return answer
  } catch (error) {

    // fetch kaster TypeError hvis requesten aldrig bliver sendt fx hvis at API'et er nede.
    if (error instanceof TypeError) {
      throw new Error(`Kunne ikke nå Gratissimo API'et på ${API_BASE}. Kører serveren?`)
    }

    else {
      throw error
    }
  }
}

// Images live on /assets, which is outside /api, so they are built from API_BASE alone.
export const imageUrl = (path) => (path ? `${API_BASE}${path}` : '')

export async function login(email, password) {
let session
  try{
    session = await request('/login', {
    method: 'POST',
    body: { username: email, password }
  })
  } catch (error) {
    //Tjek error message om det er login error
    if (error.message === 'Invalid credentials') {
      throw new Error(`Forkert email eller password, skrev du det rigtigt?`)
    }
    throw error
  }

  
  // Save the token in format: 
  // ('Token_name_in_cookies', 'token we get from api after login', lifetime_for_the_token_in_seconds)
  saveCookie(ACCESS_TOKEN, session.accessToken, ACCESS_LIFETIME_IN_SECONDS)
  saveCookie(REFRESH_TOKEN, session.refreshToken, REFRESH_LIFETIME_IN_SECONDS)

  return session.user
}

export async function logout() {
  const refreshToken = readCookie(REFRESH_TOKEN)

  try {
    if (refreshToken) await request('/logout', { method: 'POST', body: { refreshToken } })
  } catch {
  }

  forgetCookie(ACCESS_TOKEN)
  forgetCookie(REFRESH_TOKEN)
}

// Get the array of users from the api and access the 1st objest (also the only 1 kekw) 
// To access the information of the user. 
export async function verifySession() {
  const users = await request('/users', { needsLogin: true })

  return users[0]
}

export const createUser = (user) => 
  request('/users', { method: 'POST', body: user })

export const updateUser = (user) =>
  request('/users', { method: 'PATCH', body: user, needsLogin: true })

export const getArticles = () => request('/articles')
export const getTestimonies = () => request('/testimony')

export const getJobListings = () => request('/job-listings')

export const getRegions = () => request('/regions')
export const getJobCategories = () => request('/job-categories')
export const getWorkTypes = () => request('/workTypes')

export const subscribeNewsletter = (email) =>
  request('/newsletter', { method: 'POST', body: { email } })