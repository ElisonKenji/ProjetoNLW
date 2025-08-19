import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CreateRoomForm } from '@/components/create-room-form'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type GetRoomsAPIResponse = Array<{
  id: string
  name: string
  questionsCount: number
  createdAt: string
  tags: string[]
}>

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms')
      const result: GetRoomsAPIResponse = await response.json()
      return result
    },
  })

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <CreateRoomForm />

          <Card>
            <CardHeader>
              <CardTitle>Salas recentes</CardTitle>
              <CardDescription>
                Acesso rápido para as salas criadas recentemente
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {isLoading && (
                <p className="text-muted-foreground text-sm">
                  Carregando Salas...
                </p>
              )}
              {data?.map((room) => {
                return (
                  <Link
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                    key={room.id}
                    to={`/room/${room.id}`}
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="font-medium">{room.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs" variant="secondary">
                          {dayjs(room.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Badge>
                        <Badge className="text-xs" variant="secondary">
                          {room.questionsCount} perguntas
                        </Badge>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm">
                      Entrar
                      <ArrowRight className="size-3" />
                    </span>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
