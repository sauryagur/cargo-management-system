import {Outlet} from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import React from "react";

interface LayoutProps {
    isSimulating: boolean;
    setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
    fastForwardDays: number;
    setFastForwardDays: React.Dispatch<React.SetStateAction<number>>;
}


export default function Layout({isSimulating, setIsSimulating, fastForwardDays, setFastForwardDays}: LayoutProps) {
    const [date, setDate] = React.useState<Date>(new Date());
    return (
        <div className="min-h-screen bg-blueprint bg-cover bg-center">
            <div className="flex h-screen">
                <Sidebar date={date} setDate={setDate} isSimulating={isSimulating} setIsSimulating={setIsSimulating}
                         fastForwardDays={fastForwardDays} setFastForwardDays={setFastForwardDays}/>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}