"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Box, FileText, Import, MapPin, Pause, Play, Search, Settings, Trash2, FastForward } from "lucide-react"

interface SidebarProps {
  isSimulating: boolean
  setIsSimulating: (value: boolean) => void
  simulationDays: number
  setSimulationDays: (value: number) => void
}

export function Sidebar({ isSimulating, setIsSimulating, simulationDays, setSimulationDays }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-black/30 backdrop-blur-sm border-r border-white/10 flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-white tektur mb-4">Cargo Management</h1>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start tektur text-white/90">
            <Import className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="ghost" className="w-full justify-start tektur text-white/90">
            <FileText className="mr-2 h-4 w-4" />
            Logs
          </Button>
          <Button variant="ghost" className="w-full justify-start tektur text-white/90">
            <Box className="mr-2 h-4 w-4" />
            Place
          </Button>
          <Button variant="ghost" className="w-full justify-start tektur text-white/90">
            <Settings className="mr-2 h-4 w-4" />
            Placement
          </Button>
          <Button variant="ghost" className="w-full justify-start tektur text-white/90">
            <MapPin className="mr-2 h-4 w-4" />
            Retrieve
          </Button>
          <Button variant="ghost" className="w-full justify-start tektur text-white/90">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="ghost" className="w-full justify-start tektur text-white/90">
            <Trash2 className="mr-2 h-4 w-4" />
            Waste
          </Button>
        </div>
      </div>
      <div className="mt-auto p-4 border-t border-white/10">
        <h2 className="text-sm font-medium text-white/80 tektur mb-2">Simulation</h2>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-white/20 bg-black/20"
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <span className="text-xs text-white/70 tektur">{isSimulating ? "Running" : "Paused"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FastForward className="h-4 w-4 text-white/70" />
          <Input
            type="number"
            value={simulationDays}
            onChange={(e) => setSimulationDays(Number.parseInt(e.target.value) || 1)}
            className="h-8 bg-black/20 border-white/20 tektur text-white"
            min={1}
          />
          <span className="text-xs text-white/70 tektur">days</span>
        </div>
      </div>
    </div>
  )
}

