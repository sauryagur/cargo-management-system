"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Box, FileText, Import, MapPin, Pause, Play, Search, Settings, Trash2, FastForward } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface SidebarProps {
  isSimulating: boolean
  setIsSimulating: (value: boolean) => void
  simulationDays: number
  setSimulationDays: (value: number) => void
  onSimulate: () => void
}

export function Sidebar({
  isSimulating,
  setIsSimulating,
  simulationDays,
  setSimulationDays,
  onSimulate,
}: SidebarProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="w-64 h-full bg-black/30 backdrop-blur-sm border-r border-white/10 flex flex-col">
      <div className="p-4">
        <Link to="/">
          <h1 className="text-xl font-bold text-white tektur mb-4">Cargo Management</h1>
        </Link>
        <div className="space-y-2">
          <Button
            variant={isActive("/import") ? "secondary" : "ghost"}
            className="w-full justify-start tektur text-white/90"
            asChild
          >
            <Link to="/import">
              <Import className="mr-2 h-4 w-4" />
              Import
            </Link>
          </Button>
          <Button
            variant={isActive("/logs") ? "secondary" : "ghost"}
            className="w-full justify-start tektur text-white/90"
            asChild
          >
            <Link to="/logs">
              <FileText className="mr-2 h-4 w-4" />
              Logs
            </Link>
          </Button>
          <Button
            variant={isActive("/place") ? "secondary" : "ghost"}
            className="w-full justify-start tektur text-white/90"
            asChild
          >
            <Link to="/place">
              <Box className="mr-2 h-4 w-4" />
              Place
            </Link>
          </Button>
          <Button
            variant={isActive("/placement") ? "secondary" : "ghost"}
            className="w-full justify-start tektur text-white/90"
            asChild
          >
            <Link to="/placement">
              <Settings className="mr-2 h-4 w-4" />
              Placement
            </Link>
          </Button>
          <Button
            variant={isActive("/retrieve") ? "secondary" : "ghost"}
            className="w-full justify-start tektur text-white/90"
            asChild
          >
            <Link to="/retrieve">
              <MapPin className="mr-2 h-4 w-4" />
              Retrieve
            </Link>
          </Button>
          <Button
            variant={isActive("/search") ? "secondary" : "ghost"}
            className="w-full justify-start tektur text-white/90"
            asChild
          >
            <Link to="/search">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
          <Button
            variant={isActive("/waste") ? "secondary" : "ghost"}
            className="w-full justify-start tektur text-white/90"
            asChild
          >
            <Link to="/waste">
              <Trash2 className="mr-2 h-4 w-4" />
              Waste
            </Link>
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
          <Button variant="outline" size="icon" className="h-8 w-8 border-white/20 bg-black/20" onClick={onSimulate}>
            <FastForward className="h-4 w-4" />
          </Button>
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

