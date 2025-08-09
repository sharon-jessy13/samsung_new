import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HRHeader from "./components/HrHeader";
import ApproveState from './pages/ApproveState';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default HR request form */}
        <Route path="/" element={<HRHeader />} />

        {/* Approval page (for Manager/HR) */}
        <Route path="/approve/:instanceId" element={<ApproveState/>} />
      </Routes>
    </Router>
  );
}

export default App;
