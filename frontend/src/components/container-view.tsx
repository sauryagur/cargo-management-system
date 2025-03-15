"use client"

import { Card } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface GridItem {
  id: string
  occupied: boolean
}

interface ContainerViewProps {
  containerId: string
  gridData: GridItem[]
  onClose: () => void
}

export function ContainerView({ containerId, gridData, onClose }: ContainerViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <button onClick={onClose} className="text-white/70 hover:text-white tektur mr-2">
          ← Back
        </button>
        <h2 className="text-xl font-bold text-white/90 tektur">Container {containerId}</h2>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-4">
        <Tabs defaultValue="front">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="front" className="tektur">
              Front View
            </TabsTrigger>
            <TabsTrigger value="side" className="tektur">
              Side View
            </TabsTrigger>
            <TabsTrigger value="top" className="tektur">
              Top View
            </TabsTrigger>
          </TabsList>

          {["front", "side", "top"].map((view) => (
            <TabsContent key={view} value={view}>
              <div className="grid grid-cols-4 gap-2">
                {gridData.map((item, index) => (
                  <div
                    key={`${view}-${item.id}`}
                    className={`aspect-square rounded border ${
                      item.occupied ? "bg-blue-800 border-blue-700" : "bg-white/20 border-white/30"
                    } flex items-center justify-center`}
                  >
                    <span className="tektur text-xs text-white/90">{item.id}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <div className="mt-4">
        <h3 className="text-lg font-medium text-white/90 tektur mb-2">Container Details</h3>
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-4">
          <div className="grid grid-cols-2 gap-4 tektur text-sm">
            <div>
              <p className="text-white/70">Container ID:</p>
              <p className="text-white">{containerId}</p>
            </div>
            <div>
              <p className="text-white/70">Capacity:</p>
              <p className="text-white">16 units</p>
            </div>
            <div>
              <p className="text-white/70">Occupied:</p>
              <p className="text-white">{gridData.filter((item) => item.occupied).length} units</p>
            </div>
            <div>
              <p className="text-white/70">Available:</p>
              <p className="text-white">{gridData.filter((item) => !item.occupied).length} units</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

