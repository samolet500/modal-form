import { defineEventHandler, readBody } from 'h3'
import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ query: string }>(event)

  if (!body?.query) {
    return { suggestions: [] }
  }

  const token = process.env.DADATA_TOKEN // ⚠️ добавь в .env

  const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({ query: body.query, count: 5 })
  })

  const data = await response.json()
  return data
})
