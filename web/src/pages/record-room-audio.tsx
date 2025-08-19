/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { ArrowLeft } from 'lucide-react'
import { useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ManualTextForm } from '@/components/manual-text-form'
import { Button } from '@/components/ui/button'

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function'

type RoomParams = {
  roomId: string
}

export function RecordRoomAudio() {
  const params = useParams<RoomParams>()
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  function stopRecording() {
    setIsRecording(false)

    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData()
    formData.append('file', audio, 'audio.webm')

    const response = await fetch(
      `http://localhost:3333/rooms/${params.roomId}/audio`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const result = await response.json()

    console.log('Resposta do upload de áudio:', result)
    if (response.ok) {
      alert('Áudio enviado com sucesso!')
    } else {
      alert(
        `Erro ao fazer upload de áudio: ${result.message || response.statusText}`
      )
    }
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    })

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data)
      }
    }

    recorder.current.onstart = () => {
      console.log('Gravação iniciada!')
    }

    recorder.current.onstop = () => {
      console.log('Gravação encerrada/pausada')
    }

    recorder.current.start()
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('O seu navegador não suporta gravação')
      return
    }

    setIsRecording(true)

    try {
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44_100,
        },
      })

      createRecorder(audio)

      intervalRef.current = setInterval(() => {
        recorder.current?.stop()
        createRecorder(audio)
      }, 5000)
    } catch (error) {
      console.error('Erro ao acessar microfone:', error)
      alert('Não foi possível acessar o microfone. Verifique as permissões.')
      setIsRecording(false)
    }
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }

  return (
    <div className="relative flex h-screen flex-col bg-black text-white">
      <header className="relative flex h-16 items-center">
        <div className="-translate-x-1/2 absolute left-1/4 flex items-center">
          <Button
            className="flex items-center gap-2 border border-gray-600 px-3 py-2 text-white hover:bg-gray-800"
            onClick={() => navigate('/')}
            variant="outline"
          >
            <ArrowLeft className="size-4" />
            Voltar ao Início
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start gap-6 p-4">
        <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-800 p-6 shadow-lg">
          <h2 className="font-semibold text-xl">Gravação de Áudio</h2>
          {isRecording ? (
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={stopRecording}
            >
              Pausar gravação
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={startRecording}
            >
              Gravar áudio
            </Button>
          )}
          <p className="text-gray-300 text-lg">
            {isRecording ? 'Gravando...' : 'Pausado'}
          </p>
        </div>

        <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
          <ManualTextForm roomId={params.roomId} />
        </div>
      </main>
    </div>
  )
}
