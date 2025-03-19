import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Box,
    CalendarDays,
    FastForward,
    FileText,
    Import,
    LayoutDashboard,
    LayoutGrid,
    PackageSearch,
    Pause,
    Play,
    Search as SearchIcon,
    Trash2,
} from "lucide-react";
import { Input } from "./ui/input";

interface SidebarProps {
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    isSimulating: boolean;
    setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
    fastForwardDays: number;
    setFastForwardDays: React.Dispatch<React.SetStateAction<number>>;
}

export default function Sidebar({
                                    date,
                                    setDate,
                                    isSimulating,
                                    setIsSimulating,
                                    fastForwardDays,
                                    setFastForwardDays,
                                }: SidebarProps) {
    const location = useLocation();

    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`;

    return (
        <div className="w-64 bg-black/30 backdrop-blur-sm border-r border-white/10">
            <div className="flex flex-col h-full p-4">
                <h1 className="text-xl font-bold text-white tektur mb-4">CaMaSyst</h1>

                <div className="space-y-2 flex-1">
                    <NavButton to="/" icon={<LayoutDashboard className="mr-2 h-4 w-4" />} label="Dashboard" />
                    <NavButton to="/import" icon={<Import className="mr-2 h-4 w-4" />} label="Import" />
                    <NavButton to="/logs" icon={<FileText className="mr-2 h-4 w-4" />} label="Logs" />
                    <NavButton to="/place" icon={<Box className="mr-2 h-4 w-4" />} label="Place" />
                    <NavButton to="/placement" icon={<LayoutGrid className="mr-2 h-4 w-4" />} label="Placement" />
                    <NavButton to="/search" icon={<SearchIcon className="mr-2 h-4 w-4" />} label="Search" />
                    <NavButton to="/retrieve" icon={<PackageSearch className="mr-2 h-4 w-4" />} label="Retrieve" />
                    <NavButton to="/waste" icon={<Trash2 className="mr-2 h-4 w-4" />} label="Waste" />
                </div>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center mb-2 text-white/70">
                        <CalendarDays className="mr-2 h-5 w-5" />
                        <span className="text-white">Current Date</span>
                    </div>
                    <div
                        className="text-xl text-white font-mono tektur tracking-wider text-center bg-white/10 p-3 rounded-xl shadow-inner"
                    >
                        {formattedDate}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => setIsSimulating(!isSimulating)}
                        >
                            {isSimulating ? (
                                <Pause className="mr-2 h-4 w-4"/>
                            ) : (
                                <Play className="mr-2 h-4 w-4" />
                            )}
                            Simulate
                        </Button>

                        {isSimulating && (
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    placeholder="Days"
                                    value={fastForwardDays}
                                    onChange={(e) => setFastForwardDays(Number(e.target.value) || 1)}
                                    min={1}
                                    className="h-8 bg-white/5 border-white/10 text-white"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                                    onClick={() =>
                                        setDate((prevDate) => new Date(prevDate.getTime() + 86400000 * fastForwardDays))
                                    }
                                >
                                    <FastForward className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    function NavButton({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) {
        return (
            <Link to={to}>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-white/70 hover:text-white hover:bg-white/10",
                        location.pathname === to && "bg-white/10 text-white"
                    )}
                >
                    {icon}
                    {label}
                </Button>
            </Link>
        );
    }
}
