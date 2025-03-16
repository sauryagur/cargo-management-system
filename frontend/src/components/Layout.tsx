import {Outlet} from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import React from "react";

export default function Layout() {

    const [date, setDate] = React.useState<Date>(new Date());
    return (
        <div className="min-h-screen bg-blueprint bg-cover bg-center">
            <div className="flex h-screen">
                <Sidebar date={date} setDate={setDate}/>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}