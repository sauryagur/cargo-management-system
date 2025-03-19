import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ContainerItem {
    id: string;
    occupied: boolean;
    position: {
        x: number;
        y: number;
        z: number;
    };
}

interface ContainerViewProps {
    id: string;
    items: ContainerItem[];
}

function ContainerView({ id, items }: ContainerViewProps) {
    const gridSize = 5;

    return (
        <div className="space-y-4">
            <div className="text-sm font-medium text-white/70">Container {id}</div>
            <div className="grid grid-cols-3 gap-4">
                {/* Front View */}
                <div className="space-y-2">
                    <div className="text-xs text-white/50">Front View</div>
                    <div className="grid grid-cols-5 gap-0.5 bg-white/5 p-2 rounded-lg">
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                            <div
                                key={`front-${i}`}
                                className={cn(
                                    'aspect-square rounded-sm',
                                    items.some(
                                        (item) =>
                                            item.position.x === i % gridSize &&
                                            item.position.y === Math.floor(i / gridSize)
                                    )
                                        ? 'bg-blue-600'
                                        : 'bg-white/10'
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Side View */}
                <div className="space-y-2">
                    <div className="text-xs text-white/50">Side View</div>
                    <div className="grid grid-cols-5 gap-0.5 bg-white/5 p-2 rounded-lg">
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                            <div
                                key={`side-${i}`}
                                className={cn(
                                    'aspect-square rounded-sm',
                                    items.some(
                                        (item) =>
                                            item.position.y === i % gridSize &&
                                            item.position.z === Math.floor(i / gridSize)
                                    )
                                        ? 'bg-blue-600'
                                        : 'bg-white/10'
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Top View */}
                <div className="space-y-2">
                    <div className="text-xs text-white/50">Top View</div>
                    <div className="grid grid-cols-5 gap-0.5 bg-white/5 p-2 rounded-lg">
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                            <div
                                key={`top-${i}`}
                                className={cn(
                                    'aspect-square rounded-sm',
                                    items.some(
                                        (item) =>
                                            item.position.x === i % gridSize &&
                                            item.position.z === Math.floor(i / gridSize)
                                    )
                                        ? 'bg-blue-600'
                                        : 'bg-white/10'
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface RoomProps {
    id: string;
    name: string;
    containers: {
        id: string;
        items: ContainerItem[];
    }[];
}

export default function RoomGrid({ rooms }: { rooms: RoomProps[] }) {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

    const selectedContainerData = rooms
        .find((r) => r.id === selectedRoom)
        ?.containers.find((c) => c.id === selectedContainer);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                {rooms.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => {
                            setSelectedRoom(room.id === selectedRoom ? null : room.id);
                            setSelectedContainer(null);
                        }}
                        className={cn(
                            'p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-colors',
                            selectedRoom === room.id && 'bg-white/20 border-white/40'
                        )}
                    >
                        <p className="text-white font-tektur">{room.name}</p>
                    </button>
                ))}
            </div>

            {selectedRoom && (
                <div className="mt-8">
                    <div className="grid grid-cols-4 gap-4">
                        {rooms
                            .find((r) => r.id === selectedRoom)
                            ?.containers.map((container) => (
                                <button
                                    key={container.id}
                                    onClick={() =>
                                        setSelectedContainer(
                                            container.id === selectedContainer ? null : container.id
                                        )
                                    }
                                    className={cn(
                                        'p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-colors',
                                        selectedContainer === container.id && 'bg-white/20 border-white/40'
                                    )}
                                >
                                    <p className="text-white font-tektur text-sm">Container {container.id}</p>
                                </button>
                            ))}
                    </div>

                    {selectedContainerData && (
                        <>
                            {/* Container Info Card */}
                            <h3 className="text-lg font-medium text-white/90 tektur mt-8 mb-2">Container Details</h3>
                            <Card
                                className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl max-w-full min-w-5 mx-auto">
                                <div className="grid grid-cols-2 gap-6 tektur text-sm">
                                    <div>
                                        <p className="text-white/70">Container ID:</p>
                                        <p className="text-white">{selectedContainerData.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/70">Capacity:</p>
                                        <p className="text-white">16 units</p>
                                    </div>
                                    <div>
                                        <p className="text-white/70">Occupied:</p>
                                        <p className="text-white">
                                            {selectedContainerData.items.filter((item) => item.occupied).length} units
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/70">Available:</p>
                                        <p className="text-white">
                                            {16 - selectedContainerData.items.filter((item) => item.occupied).length} units
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Container View */}
                            <div className="mt-8">
                                <ContainerView id={selectedContainerData.id} items={selectedContainerData.items}/>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
