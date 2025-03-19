import { useState, useEffect } from "react";
import axios from "axios";

export default function Logs() {
    const [logs, setLogs] = useState<string>("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/logs");
                setLogs(response.data); // Ensure logs are set correctly
            } catch (error) {
                console.error("Error fetching logs:", error);
                setLogs("Failed to load logs.");
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-tektur text-white mb-8">System Logs</h1>
            <div className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-white/20">
                <pre className="text-white/70 ubuntu-mono-regular">{logs || "No logs available."}</pre>
            </div>
        </div>
    );
}
