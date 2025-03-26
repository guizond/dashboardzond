import React, { useState } from "react";
import './EventForm.css';

const EventForm = ({ onSave, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        onSave({ title, description });

        setTitle("");
        setDescription("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Adicionar evento</h2>
                <form onSubmit={handleSubmit}>
                    <label>Título</label>
                    <input className="form-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label>Descrição</label>
                    <textarea className="form-description"
                        value={description}
                        onChange={handleDescriptionChange}
                        style={{ minHeight: "50px", overflowY: "hidden" }} 
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