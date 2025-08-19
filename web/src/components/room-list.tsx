import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRooms } from '@/http/use-rooms'
import { dayjs } from '@/lib/dayjs'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export function RoomList() {
  const { data, isLoading } = useRooms()

  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    if (!data) {
      return []
    }
    const tagsSet = new Set<string>()
    for (const room of data) {
      if (Array.isArray(room.tags)) {
        for (const tag of room.tags) {
          tagsSet.add(tag)
        }
      }
    }
    return Array.from(tagsSet)
  }, [data])

  const filteredRooms = useMemo(() => {
    if (!data) {
      return []
    }
    if (!selectedTag) {
      return data
    }
    return data.filter((room) => {
      return Array.isArray(room.tags) && room.tags.includes(selectedTag)
    })
  }, [data, selectedTag])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salas recentes</CardTitle>
        <CardDescription>
          Acesso rápido para as salas criadas recentemente
        </CardDescription>
      </CardHeader>

      <CardContent className="mb-4 flex flex-wrap gap-2">
        <button
          className={`rounded-full px-3 py-1 font-semibold text-xs ${
            selectedTag === null
              ? 'bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedTag(null)}
          type="button"
        >
          Todas
        </button>
        {allTags.map((tag) => (
          <button
            className={`rounded-full px-3 py-1 font-semibold text-xs ${
              selectedTag === tag
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            key={tag}
            onClick={() => setSelectedTag(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </CardContent>

      <CardContent className="flex flex-col gap-3">
        {isLoading && (
          <p className="text-muted-foreground text-sm">Carregando salas...</p>
        )}

        {filteredRooms?.map((room) => (
          <Link
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
            key={room.id}
            to={`/room/${room.id}`}
          >
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="font-medium">{room.name}</h3>

              <div className="flex items-center gap-2">
                <Badge className="text-xs" variant="secondary">
                  {dayjs(room.createdAt).toNow()}
                </Badge>
                <Badge className="text-xs" variant="secondary">
                  {room.questionsCount} pergunta(s)
                </Badge>
              </div>

              {Array.isArray(room.tags) && room.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {room.tags.map((tag, index) => (
                    <span
                      className="rounded-full bg-blue-700 px-2 py-1 text-white text-xs"
                      key={typeof tag === 'string' ? tag : index}
                    >
                      {typeof tag === 'string' ? tag : String(tag)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <span className="flex items-center gap-1 text-sm">
              Entrar
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}

        {!isLoading && filteredRooms.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Nenhuma sala encontrada para a tag selecionada.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
