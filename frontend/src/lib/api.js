const BASE = import.meta.env.VITE_API_URL || ''

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  createLink: (url) => request('POST', '/api/links', { url }),
  listLinks: (limit, offset) => request('GET', `/api/links?limit=${limit}&offset=${offset}`),
  getLink: (id) => request('GET', `/api/links/${id}`),
  deleteLink: (id) => request('DELETE', `/api/links/${id}`),
  getStats: () => request('GET', '/api/stats'),
}
