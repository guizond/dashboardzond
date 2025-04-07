import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import './BuildersPage.css';

const BuildersPage = () => {
    const [builders, setBuilders] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [builderName, setBuilderName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [client, setClient] = useState("");
    const [whitelabel, setWhitelabel] = useState("");
    const [builderPassword, setBuilderPassword] = useState("");
    const [hasSupport, setHasSupport] = useState("");
    const [supportLink, setSupportLink] = useState("");
    const [dashboard, setDashboard] = useState("");
    const [productsLimit, setProductsLimit] = useState("");
    const [storeLanguage, setStoreLanguage] = useState("");
    const [builderLanguage, setBuilderLanguage] = useState("");
    const [storeCountry, setStoreCountry] = useState("");
    const [expandedCard, setExpandedCard] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [sortBy, setSortBy] = useState("whitelabel");
    const [sortOrder, setSortOrder] = useState("asc");

    const buildersCollectionRef = collection(db, "builders");
      
    useEffect(() => {
        document.title = "Builders";
        const fetchBuilders = async () => {
        const data = await getDocs(buildersCollectionRef);
        setBuilders(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      };
      
      fetchBuilders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const newBuilder = { 
            builderName, 
            description, 
            link, 
            client, 
            whitelabel, 
            builderPassword, 
            hasSupport, 
            supportLink, 
            dashboard, 
            productsLimit, 
            storeLanguage, 
            builderLanguage, 
            storeCountry,
            isActive,
            createdAt: new Date()
        };
      
        const docRef = await addDoc(buildersCollectionRef, newBuilder);
        setBuilders([...builders, { ...newBuilder, id: docRef.id }]);
      
        setBuilderName("");
        setClient("");
        setLink("");
        setWhitelabel("");
        setBuilderPassword("");
        setHasSupport("");
        setSupportLink("");
        setDashboard("");
        setProductsLimit("");
        setStoreLanguage("");
        setBuilderLanguage("");
        setStoreCountry("");
        setIsFormOpen(false);
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "builders", id));
        setBuilders(builders.filter(builder => builder.id !== id));
    };

    const toggleActiveStatus = async (id) => {
        const builderRef = doc(db, "builders", id);
        const updatedBuilders = builders.map(builder => 
            builder.id === id ? { ...builder, isActive: !builder.isActive } : builder
        );
        setBuilders(updatedBuilders);
        
        await updateDoc(builderRef, { isActive: !builders.find(builder => builder.id === id).isActive });
    };

    const handleCardClick = (id) => {
        if (expandedCard === null) {
            setExpandedCard(id);
        }
    };

    const sortedBuilders = [...builders].sort((a, b) => {
        let valA = a[sortBy] || "";
        let valB = b[sortBy] || "";
    
        // Se for 'createdAt', trata como data
        if (sortBy === "createdAt") {
            const dateA = valA?.toDate ? valA.toDate() : new Date(valA);
            const dateB = valB?.toDate ? valB.toDate() : new Date(valB);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }
    
        // Tenta converter para número se possível
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
    
        const isNumeric = !isNaN(numA) && !isNaN(numB);
    
        if (isNumeric) {
            return sortOrder === "asc" ? numA - numB : numB - numA;
        }
    
        // Fallback para string normal
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
    });

    return (
        <div className="builders-container">
            <div className="builders-header-container">
                <button
                    className="sort-controls-button"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    {sortOrder === "asc" ? "⬆ Crescente" : "⬇ Decrescente"}
                </button>
                <button className="add-builder-button" onClick={() => setIsFormOpen(true)}>+ Adicionar Builder</button>
            </div>

            <div className="builders-list">
                {sortedBuilders.map((builder) => (
                    <div key={builder.id} className="builder-card" onClick={() => handleCardClick(builder.id)}>
                        <div className="builder-card-header">
                            <h3>{`${builder.whitelabel} - ${builder.builderName}`}</h3>
                            <div className="builder-switch" onClick={(e) => e.stopPropagation()}>
                                <span className={`switch ${builder.isActive ? "active" : ""}`} onClick={() => toggleActiveStatus(builder.id)}>
                                    <span className="switch-handle"></span>
                                </span>
                            </div>
                        </div>
                        
                        {expandedCard === builder.id && (
                            <div className="builder-details">
                                <p><strong>Cliente:</strong> {builder.client}</p>
                                <p><strong>Link:</strong> {builder.link}</p>
                                <p><strong>Whitelabel:</strong> {builder.whitelabel}</p>
                                <p><strong>Senha do Builder:</strong> {builder.builderPassword}</p>
                                <p><strong>Suporte:</strong> {builder.hasSupport}</p>
                                <p><strong>Link de Suporte:</strong> {builder.supportLink}</p>
                                <p><strong>Dashboard:</strong> {builder.dashboard}</p>
                                <p><strong>Limite de Produtos:</strong> {builder.productsLimit}</p>
                                <p><strong>Idioma da Loja:</strong> {builder.storeLanguage}</p>
                                <p><strong>Idioma do Builder:</strong> {builder.builderLanguage}</p>
                                <p><strong>País de criação da loja:</strong> {builder.storeCountry}</p>

                                <div className="card-actions">
                                    <button className="close-details" onClick={() => setExpandedCard(null)}>Fechar</button>
                                    <button className="delete-button" onClick={() => handleDelete(builder.id)}>Deletar</button>
                                </div>
                            </div>
                        )}
                        
                    </div>
                ))}
            </div>

            {isFormOpen && (
                <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Adicionar Builder</h2>
                        <form onSubmit={handleSubmit} className="builder-form">
                            <div className="form-group">
                                <label>Nome do Builder</label>
                                <input type="text" value={builderName} onChange={(e) => setBuilderName(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label>Cliente</label>
                                <input type="text" value={client} onChange={(e) => setClient(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Link</label>
                                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Whitelabel</label>
                                <input type="text" value={whitelabel} onChange={(e) => setWhitelabel(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Senha do Builder</label>
                                <input type="password" value={builderPassword} onChange={(e) => setBuilderPassword(e.target.value)} />
                            </div>

                            <div className="form-group support-group">
                                <label>Tem Suporte?</label>
                                <select value={hasSupport} onChange={(e) => setHasSupport(e.target.value)}>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Link de Suporte</label>
                                <input type="text" value={supportLink} onChange={(e) => setSupportLink(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Dashboard</label>
                                <input type="text" value={dashboard} onChange={(e) => setDashboard(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Limite de Produtos</label>
                                <input type="number" value={productsLimit} onChange={(e) => setProductsLimit(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Idioma da Loja</label>
                                <input type="text" value={storeLanguage} onChange={(e) => setStoreLanguage(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Idioma do Builder</label>
                                <input type="text" value={builderLanguage} onChange={(e) => setBuilderLanguage(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>País de criação da Loja</label>
                                <input type="text" value={storeCountry} onChange={(e) => setStoreCountry(e.target.value)} />
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="save-button">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuildersPage;