import RoomGrid from '@/components/RoomGrid';

// Mock data - replace with API data
const mockRooms = [
  {
    id: '1',
    name: 'Airlock',
    containers: [
      {
        id: 'A1',
        items: [
          { id: '1', occupied: true, position: { x: 0, y: 0, z: 0 } },
          { id: '2', occupied: true, position: { x: 1, y: 1, z: 1 } },
        ],
      },
      {
        id: 'A2',
        items: [
          { id: '3', occupied: true, position: { x: 2, y: 2, z: 2 } },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Crew Quarters',
    containers: [
      {
        id: 'B1',
        items: [
          { id: '4', occupied: true, position: { x: 0, y: 1, z: 2 } },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Laboratory',
    containers: [
      {
        id: 'C1',
        items: [
          { id: '5', occupied: true, position: { x: 3, y: 3, z: 3 } },
        ],
      },
    ],
  },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-tektur text-white mb-8">
        Space Station Cargo Management
      </h1>
      <RoomGrid rooms={mockRooms} />
    </div>
  );
}