import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";

import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";

import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/notifications" element={<TopBarNotification />} />
        <Route path="/mail" element={<TopBarMail />} />

        <Route path="/job-postings/view/:id" element={<JobDetail />} />

        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
