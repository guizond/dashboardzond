import React, { useState, useEffect } from "react";
import './EventForm.css';

const EventForm = ({ onSave, onClose, eventDetails }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (eventDetails) {
      setTitle(eventDetails.title);
      setDescription(eventDetails.description);
      setStart(eventDetails.start);
      setEnd(eventDetails.end);
    }
  }, [eventDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: eventDetails ? eventDetails.id : null, title, description, start, end });
  };

  return (
    <div className="modal">
      <h2>{eventDetails ? "Editar Evento" : "Criar Novo Evento"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <div className="modal-buttons">
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Fechar</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;