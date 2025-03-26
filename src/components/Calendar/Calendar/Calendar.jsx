import { db } from "../../../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBr from "@fullcalendar/core/locales/pt-br";
import EventForm from "../EventForm/EventForm";
import EventDetails from "../EventDetails/EventDetails";
import './calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "events"));
            const eventsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    description: data.description || "",
                    start: data.start ? new Date(data.start).toISOString() : new Date().toISOString(),
                    end: data.end ? new Date(data.end).toISOString() : new Date().toISOString(),
                };
            });

            console.log("Eventos carregados do Firestore:", eventsData);
            setEvents(eventsData);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        }
    };

    fetchEvents();
}, []);

  const handleDateClick = (arg) => {
      if (clickTimeout) {
          clearTimeout(clickTimeout);
          setClickTimeout(null);
          handleDateDoubleClick(arg);
      } else {
          const timeout = setTimeout(() => {
              setClickTimeout(null);
          }, 300);
          setClickTimeout(timeout);
      }
  };

  const handleDateDoubleClick = (arg) => {
      setSelectedDate(arg.dateStr);
      setIsModalOpen(true);
      setEventDetails(null);
      setIsEditing(false);

      const adjustedEndDate = new Date(arg.dateStr);
      adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() + 30);
      setSelectedEndDate(adjustedEndDate.toISOString().slice(0, 16));
  };

  const handleEventClick = (info) => {
      setEventDetails({
          id: info.event.id,
          title: info.event.title,
          description: info.event.extendedProps.description || "",
          start: info.event.startStr,
        end: info.event.endStr
      });
      setIsModalOpen(true);
      setSelectedDate(info.event.startStr);
      setIsEditing(false);
  };

  const handleSaveEvent = async ({ id, title, description, start, end }) => {
    try {
      if (!end) {
        const startTime = new Date(start);
        end = new Date(startTime.getTime() + 30 * 60000).toISOString();
      }
  
      if (id) {
        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, { title, description, start, end });
        setEvents(events.map(event => event.id === id ? { ...event, title, description, start, end } : event));
      } else {
        const newEvent = { title, description, start, end };
        const docRef = await addDoc(collection(db, "events"), newEvent);
        setEvents([...events, { id: docRef.id, ...newEvent }]);
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    }
  
    setIsModalOpen(false);
  };

const handleEventDrop = async (info) => {
    try {
        const eventRef = doc(db, "events", info.event.id);
        await updateDoc(eventRef, {
            start: info.event.start.toISOString(),
            end: info.event.end ? info.event.end.toISOString() : null
        });

        setEvents(events.map(event => 
            event.id === info.event.id
                ? { ...event, start: info.event.start, end: info.event.end }
                : event
        ));
    } catch (error) {
        console.error("Erro ao mover evento:", error);
    }
};

const handleEventResize = async (info) => {
    try {
        const eventRef = doc(db, "events", info.event.id);
        await updateDoc(eventRef, {
            start: info.event.start.toISOString(),
            end: info.event.end.toISOString()
        });

        setEvents(events.map(event => 
            event.id === info.event.id
                ? { ...event, start: info.event.start, end: info.event.end }
                : event
        ));
    } catch (error) {
        console.error("Erro ao redimensionar evento:", error);
    }
};

const handleEditEvent = () => {
  setIsEditing(true);
  setIsModalOpen(true);
};

const handleDeleteEvent = async () => {
  if (!eventDetails || !eventDetails.id) return;

  try {
      await deleteDoc(doc(db, "events", eventDetails.id));
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventDetails.id));
  } catch (error) {
      console.error("Erro ao excluir evento:", error);
  }

  setIsModalOpen(false);
  setEventDetails(null);
  setIsEditing(false);
};

return (
    <div className="calendar-container">
      <FullCalendar
        locale={ptBr}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventDurationEditable={true}
        eventOverlap={true}
        displayEventTime={true}
        allDaySlot={true}
        longPressDelay={300}
      />
  
  {isModalOpen && (
    <div className="modal-overlay">
        {isEditing && (
            <EventForm
                onSave={handleSaveEvent}
                onClose={() => setIsModalOpen(false)}
                eventDetails={eventDetails}
            />
        )}

        {!isEditing && eventDetails && (
            <EventDetails
                event={eventDetails}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onClose={() => setIsModalOpen(false)}
            />
        )}

        {!eventDetails && !isEditing && (
            <EventForm
                onSave={handleSaveEvent}
                onClose={() => setIsModalOpen(false)}
                start={selectedDate}  // Passando a data de início
                end={selectedEndDate}  // Passando a data de fim
            />
        )}
    </div>
      )}
    </div>
  );
};

export default Calendar;