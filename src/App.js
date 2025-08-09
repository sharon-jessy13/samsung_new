import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HRHeader from "./components/HrHeader";
import ApproveState from './pages/ApproveState';
import ReportState from './pages/ReportState';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default HR request form */}
        <Route path="/" element={<HRHeader />} />

        {/* Approval page (for Manager/HR) */}
        <Route path="/approve/:instanceId" element={<ApproveState/>} />
        
        {/* Report page (after approval) */}
        <Route path="/report/:instanceId" element={<ReportState/>} />
      </Routes>
    </Router>
  );
}

export default App;
