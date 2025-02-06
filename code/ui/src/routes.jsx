import React from 'react';
import { Route, BrowserRouter, Routes } from "react-router-dom";
import View from './views/View';
import Extract from './views/Extract';
import Analyze from './views/Analyze';
import Discover from './views/Discover';
import Report from './views/Report';

function Routings() {
    return (
            <Routes>
                <Route path= "/" element={<View />} />
                <Route path= "/discover" element={<Discover />} />
                <Route path= "/extract" element={<Extract />} />
                <Route path= "/analyze" element={<Analyze />} />
                <Route path= "/report" element={<Report />} />
                <Route path= "/view" element={<View />} />
                <Route path= "*" element={<>Waste of Energy</>} />
            </Routes>
    );
}
export default Routings;