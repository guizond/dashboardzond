import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import './FAQPage.css';

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
  
    // 🔹 Referência à coleção "faqs" no Firestore
    const faqsCollectionRef = collection(db, "faqs");
  
    // 🔹 Buscar FAQs do Firestore ao carregar a página
    useEffect(() => {
      const fetchFaqs = async () => {
        const data = await getDocs(faqsCollectionRef);
        setFaqs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      };
  
      fetchFaqs();
    }, []);
  
    // 🔹 Adicionar um novo FAQ ao Firestore
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const newFaq = { title, description, link };
  
      const docRef = await addDoc(faqsCollectionRef, newFaq);
      setFaqs([...faqs, { ...newFaq, id: docRef.id }]);
  
      setTitle("");
      setDescription("");
      setLink("");
      setIsFormOpen(false);
    };
  
    // 🔹 Deletar um FAQ do Firestore
    const handleDelete = async (id) => {
      await deleteDoc(doc(db, "faqs", id));
      setFaqs(faqs.filter(faq => faq.id !== id));
    };

  return (
    <div className="faq-container">
      {/* Container para alinhar o botão à direita */}
      <div className="faq-header-container">
        <button className="add-faq-button" onClick={() => setIsFormOpen(true)}>+ Adicionar FAQ</button>
      </div>
      
      {/* Lista de FAQs */}
      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-card" onClick={() => setSelectedFaq(selectedFaq === faq.id ? null : faq.id)}>
            <div className="faq-header">
              <span>{faq.title}</span>
              <button className="delete-button" onClick={(e) => {e.stopPropagation(); handleDelete(faq.id);}}>Deletar</button>
            </div>
            {selectedFaq === faq.id && (
              <div className="faq-details">
                <p>Descrição: {faq.description}</p>
                <a href={faq.link} target="_blank" rel="noopener noreferrer">
  {faq.link ? decodeURIComponent(faq.link.split('/').pop().replace(/[-_]/g, ' ')) : "Ver Documento"}
</a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Adicionar FAQ */}
      {isFormOpen && (
  <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h2>Adicionar FAQ</h2>
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
          type="url"
          placeholder="Link do Documento"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <div className="modal-buttons">
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setIsFormOpen(false)}>Fechar</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default FAQPage;