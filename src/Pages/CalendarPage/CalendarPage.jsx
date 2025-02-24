import React from "react";
import Calendar from "../../components/Calendar/calendar";
import './CalendarPage.css'

const CalendarPage = () => {
  return (
    <div className="calendar-page-content">
      <h1>Meu Calendário</h1>
      <Calendar />
    </div>
  );
};

export default CalendarPage;