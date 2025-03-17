import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";  // Importar o Sidebar aqui
import Calendar from "../../components/Calendar/Calendar/Calendar";
import './CalendarPage.css';

const CalendarPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <div className="content-main">
        <Calendar isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default CalendarPage;