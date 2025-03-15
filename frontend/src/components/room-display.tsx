"use client"

import { Card } from "./ui/card"

interface Room {
  id: string
  name: string
}

interface Container {
  id: string
  name: string
}

interface RoomDisplayProps {
  rooms: Room[]
  containers: Record<string, Container[]>
  selectedRoom: string | null
  onRoomClick: (roomId: string) => void
  onContainerClick: (containerId: string) => void
}

export function RoomDisplay({ rooms, containers, selectedRoom, onRoomClick, onContainerClick }: RoomDisplayProps) {
  return (
    <div className="space-y-6">
      {!selectedRoom ? (
        <>
          <h2 className="text-xl font-bold text-white/90 tektur mb-4">Space Station Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                onClick={() => onRoomClick(room.id)}
              >
                <div className="p-4 flex items-center justify-center h-24">
                  <span className="tektur text-white/90 text-center">{room.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <button onClick={() => onRoomClick("")} className="text-white/70 hover:text-white tektur mr-2">
              ← Back
            </button>
            <h2 className="text-xl font-bold text-white/90 tektur">
              {rooms.find((r) => r.id === selectedRoom)?.name} Containers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {containers[selectedRoom]?.map((container) => (
              <Card
                key={container.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                onClick={() => onContainerClick(container.id)}
              >
                <div className="p-4 flex items-center justify-center h-20">
                  <span className="tektur text-white/90 text-center">{container.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

