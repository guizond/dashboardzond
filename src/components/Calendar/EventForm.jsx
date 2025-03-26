import React, { useState, useEffect } from "react";
import './EventForm.css';

const EventForm = ({ onSave, onClose, start, end, eventDetails }) => {
    const [title, setTitle] = useState(eventDetails?.title || "");
    const [description, setDescription] = useState(eventDetails?.description || "");
    const [eventStart, setEventStart] = useState(start || "");
    const [eventEnd, setEventEnd] = useState(end || "");

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        onSave({ title, description, start: eventStart, end: eventEnd });

        setTitle("");
        setDescription("");
        onClose();
    };

    useEffect(() => {
        if (eventDetails) {
            setTitle(eventDetails.title);
            setDescription(eventDetails.description);
            setEventStart(eventDetails.start);
            setEventEnd(eventDetails.end);
        }
    }, [eventDetails]);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{eventDetails ? "Editar evento" : "Adicionar evento"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Título</label>
                    <input 
                        className="form-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label>Descrição</label>
                    <textarea 
                        className="form-description"
                        value={description}
                        onChange={handleDescriptionChange}
                        style={{ minHeight: "50px", overflowY: "hidden" }} 
                    />
                    <label>Data de Início</label>
                    <input 
                        type="datetime-local" 
                        value={eventStart} 
                        onChange={(e) => setEventStart(e.target.value)} 
                        required
                    />
                    <label>Data de Término</label>
                    <input 
                        type="datetime-local" 
                        value={eventEnd} 
                        onChange={(e) => setEventEnd(e.target.value)} 
                        required
                    />
                    <div className="modal-buttons">
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;