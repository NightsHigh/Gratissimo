export const BASE = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const response = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  }).catch(() => {
    throw new Error('Der er ingen forbindelse til serveren. Prøv igen om lidt.')
  })

  // Fejl fra API kommer som { error: "besked" }. Catch JSON parse fejl hvis der ikke er noget body.
  // Tjek Issue 20 på kanban boardet
  const body = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(body?.error ?? `Serveren svarede med fejl ${response.status}.`)
    }

    return body
  }

export const subscribeNewsletter = (email) =>
  request('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email })
  })

export const getTestimonies = () => request('/testimony')

export const getArticles = () => request('/articles')

// Fetch the images on localhost:4000${article.imageUrl} fx localhost:4000/assets/images/article4.jpg
export const imageUrl = (path) => `${BASE}${path}`