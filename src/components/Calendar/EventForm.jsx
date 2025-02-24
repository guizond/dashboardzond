import React, { useState } from "react";
import './EventForm.css';

const EventForm = ({ onSave, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Função para expandir automaticamente o textarea
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        e.target.style.height = "auto"; // Reseta a altura antes de redimensionar
        e.target.style.height = e.target.scrollHeight + "px"; // Ajusta conforme o conteúdo
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
                        style={{ minHeight: "50px", overflowY: "hidden" }} // Estilo inline para garantir o comportamento
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