export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Получены данные формы:', body)

  return { ok: true }
})
