import { CreateRoomForm } from '@/components/create-room-form'
import { RoomList } from '@/components/room-list'

export function HomePage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <CreateRoomForm />
        <RoomList />
      </div>
    </div>
  )
}
