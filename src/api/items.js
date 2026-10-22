async function readResponse(response) {
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(result.message || 'The request could not be completed.')
    error.status = response.status
    error.fields = result.errors || {}
    throw error
  }

  return result
}

export async function createItem(item) {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })

  return readResponse(response)
}

export async function getItems() {
  const response = await fetch('/api/items')
  return readResponse(response)
}

export async function getItem(itemId) {
  const response = await fetch(`/api/items/${encodeURIComponent(itemId)}`)
  return readResponse(response)
}
