//Placeholder api call until ready with the actual fetch call
export const BASE = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  try {
    response = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }

    })

  } catch {
    throw new Error
  }

  try {
    return await response.json()

  } catch {
    throw new Error
  }
}

export const imageUrl = (path) => (path ? `${BASE}${path}` : '')

const PLACEHOLDER_PRODUCTS_UNTIL_API_IS_SETUP = [
  { id: 1, title: 'Spongebob Squarepants', slug: 'spongebob-squarepants', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/SpongeBob_character.svg/500px-SpongeBob_character.svg.png'},
  { id: 2, title: 'Squidward Tentacles', slug: 'squidward-tentacles', imageUrl: 'https://static.wikia.nocookie.net/viacom4633/images/e/ea/Squidward_in_2018.png' },
  { id: 3, title: 'Eugene-Crab', slug: 'eugene-crab', imageUrl: 'https://static.wikia.nocookie.net/nickelodeon/images/a/a7/Mr._Krabs_in_2018.png'},
  { id: 4, title: 'Sandy Cheeks', slug: 'sandy-cheeks', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Sandy_Cheeks_%28transparent%29.png'},
]


export const getProducts = async () => PLACEHOLDER_PRODUCTS_UNTIL_API_IS_SETUP

export const createMessage = async ({ name, email, message }) => {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      message
    })
  })
}

export const login = async ({ email, password }) => {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    })
  })
}
