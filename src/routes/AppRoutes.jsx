import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Header from "../components/Header/header";
import Sidebar from "../components/Sidebar/sidebar";
import Home from "../Pages/Home/Home";
import CalendarPage from "../Pages/CalendarPage/CalendarPage";
import FAQPage from "../Pages/FaqPage/FAQPage";
import MainLayout from "../components/MainLayout";

const AppRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <Router>
      <Header />
      <Sidebar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;