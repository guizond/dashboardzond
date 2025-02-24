import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventForm from "./EventForm";
import './calendar.css';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickTimeout, setClickTimeout] = useState(null);

    const handleDateClick = (arg) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout); // Se já houve um clique recente, cancela o timeout
            setClickTimeout(null);
            handleDateDoubleClick(arg); // Trata como duplo clique
        } else {
            const timeout = setTimeout(() => {
                setClickTimeout(null); // Se não houver segundo clique, reseta
            }, 300); // Tempo para detectar o segundo clique (ajustável)

            setClickTimeout(timeout);
        }
    };

    const handleDateDoubleClick = (arg) => {
        setSelectedDate(arg.dateStr);
        setIsModalOpen(true);
    };

    const handleEventClick = (info) => {
        alert(`📌 Título: ${info.event.title}\n📝 Descrição: ${info.event.extendedProps.description || "Sem descrição"}`);
    };

    const handleSaveEvent = ({ title, description }) => {
        if (selectedDate) {
            setEvents((prevEvents) => [
                ...prevEvents,
                { id: prevEvents.length + 1, title, date: selectedDate, description }
            ]);
        }
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable={true}
                editable={true}
                events={events}
                dateClick={handleDateClick} // Agora trata o double-click manualmente
                eventClick={handleEventClick}
            />

            {isModalOpen && (
                <EventForm onSave={handleSaveEvent} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default Calendar;