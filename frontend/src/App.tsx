import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Import from '@/pages/Import';
import Logs from '@/pages/Logs';
import Place from '@/pages/Place';
import Placement from '@/pages/Placement';
import Retrieve from '@/pages/Retrieve';
import Search from '@/pages/Search';
import Simulate from '@/pages/Simulate';
import Waste from '@/pages/Waste';
import {useState} from "react";

function App() {
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [fastForwardDays, setFastForwardDays] = useState<number>(1);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout
                            isSimulating={isSimulating}
                            setIsSimulating={setIsSimulating}
                            fastForwardDays={fastForwardDays}
                            setFastForwardDays={setFastForwardDays}
                        />
                    }
                >
                    <Route index element={<Dashboard/>}/>
                    <Route path="import" element={<Import/>}/>
                    <Route path="logs" element={<Logs/>}/>
                    <Route path="place" element={<Place/>}/>
                    <Route path="placement" element={<Placement/>}/>
                    <Route path="retrieve" element={<Retrieve/>}/>
                    <Route path="search" element={<Search/>}/>
                    <Route path="simulate" element={<Simulate/>}/>
                    <Route path="waste" element={<Waste/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;