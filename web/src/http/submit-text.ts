export async function submitText(
  roomId: string,
  text: string
): Promise<string> {
  const response = await fetch(`http://localhost:3333/rooms/${roomId}/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error('Erro ao enviar texto')
  }

  const data = await response.json()
  return data.chunkId
}
