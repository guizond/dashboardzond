import React from "react";
import './EventDetails.css';

const EventDetails = ({ event, onEdit, onDelete, onClose }) => {
  return (
    <div className="modal">
      <h2>Detalhes do Evento</h2>
      <div className="event-details">
        <p><strong>Título:</strong> {event.title}</p>
        <p><strong>Descrição:</strong> {event.description}</p>
        <p><strong>Início:</strong> {new Date(event.start).toLocaleString()}</p>
        <p><strong>Fim:</strong> {new Date(event.end).toLocaleString()}</p>
      </div>
      <div className="modal-buttons">
        <button onClick={onEdit} className="edit-button">Editar</button>
        <button onClick={onDelete} className="delete-button">Excluir</button>
        <button onClick={onClose} className="close-button">X</button>
      </div>
    </div>
  );
};

export default EventDetails;