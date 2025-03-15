"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { RoomDisplay } from "./room-display"
import { ContainerView } from "./container-view"

// Mock data for initial display
const mockRooms = [
  { id: "r1", name: "Airlock" },
  { id: "r2", name: "Crew Quarters" },
  { id: "r3", name: "Laboratory" },
  { id: "r4", name: "Storage Bay" },
  { id: "r5", name: "Command Center" },
  { id: "r6", name: "Medical Bay" },
]

const mockContainers = {
  r1: [
    { id: "c1", name: "Container A1" },
    { id: "c2", name: "Container A2" },
  ],
  r2: [
    { id: "c3", name: "Container B1" },
    { id: "c4", name: "Container B2" },
    { id: "c5", name: "Container B3" },
  ],
  r3: [
    { id: "c6", name: "Container C1" },
    { id: "c7", name: "Container C2" },
  ],
  r4: [
    { id: "c8", name: "Container D1" },
    { id: "c9", name: "Container D2" },
    { id: "c10", name: "Container D3" },
    { id: "c11", name: "Container D4" },
  ],
  r5: [{ id: "c12", name: "Container E1" }],
  r6: [
    { id: "c13", name: "Container F1" },
    { id: "c14", name: "Container F2" },
  ],
}

// Mock grid data for container items
const mockGridData = {
  c1: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c2: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c3: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c4: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c5: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c6: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c7: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c8: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c9: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c10: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c11: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c12: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c13: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
  c14: Array(16)
    .fill(null)
    .map((_, i) => ({ id: `i${i}`, occupied: Math.random() > 0.5 })),
}

export default function CargoManagementSystem() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationDays, setSimulationDays] = useState(1)

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId)
    setSelectedContainer(null)
  }

  const handleContainerClick = (containerId: string) => {
    setSelectedContainer(containerId)
  }

  const handleCloseContainer = () => {
    setSelectedContainer(null)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden blueprint-bg">
      <Sidebar
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        simulationDays={simulationDays}
        setSimulationDays={setSimulationDays}
      />
      <main className="flex-1 p-4 overflow-auto">
        {selectedContainer ? (
          <ContainerView
            containerId={selectedContainer}
            gridData={mockGridData[selectedContainer as keyof typeof mockGridData]}
            onClose={handleCloseContainer}
          />
        ) : (
          <RoomDisplay
            rooms={mockRooms}
            containers={mockContainers}
            selectedRoom={selectedRoom}
            onRoomClick={handleRoomClick}
            onContainerClick={handleContainerClick}
          />
        )}
      </main>
    </div>
  )
}

