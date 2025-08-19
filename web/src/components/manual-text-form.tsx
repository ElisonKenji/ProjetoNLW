import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { submitText } from '@/http/submit-text'
import { Button } from './ui/button'

interface ManualTextFormProps {
  roomId: string
}

export function ManualTextForm({ roomId }: ManualTextFormProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)

    try {
      const chunkId = await submitText(roomId, text)
      setSuccessMessage(`Texto enviado! ID do chunk: ${chunkId}`)
      setText('')
      // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    } catch (err) {
      alert('Erro ao enviar o texto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mb-6 space-y-3" onSubmit={handleSubmit}>
      <label
        className="block font-medium text-foreground text-sm"
        htmlFor="manual-text"
      >
        Adicionar Texto Manualmente
      </label>

      <Textarea
        disabled={loading}
        id="manual-text"
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite o texto para a IA processar"
        required
        value={text}
      />

      <Button disabled={loading} type="submit">
        {loading ? 'Enviando...' : 'Enviar'}
      </Button>

      {successMessage && (
        <p className="text-green-500 text-sm">{successMessage}</p>
      )}
    </form>
  )
}
