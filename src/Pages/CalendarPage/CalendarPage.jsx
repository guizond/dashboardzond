import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Calendar from "../../components/Calendar/Calendar/Calendar";
import './CalendarPage.css';

const CalendarPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Calendário";
  })

  return (
    <div>
      <div className="content-main">
        <Calendar isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default CalendarPage;