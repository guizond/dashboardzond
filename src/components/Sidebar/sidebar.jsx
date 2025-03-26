import './sidebar.css';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaCalendarAlt, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { FaComputer } from "react-icons/fa6";
import Calendar from '../Calendar/Calendar/Calendar';
import { auth } from '../../firebaseConfig';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/authpage");
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    return (
        <div className={`sidebar-container ${isOpen ? 'expanded' : 'collapsed'}`}>
            <div className="toggle-icon" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>

            <div className="content">
                    <>
                        <Link to="/" className="menu-item"><FaHome className="menu-icon" /> {isOpen && "Home"}</Link>
                        <Link to="/calendar" className="menu-item"><FaCalendarAlt className="menu-icon" /> {isOpen && "Calendário"}</Link>
                        <Link to="/docs" className="menu-item"><FaQuestionCircle className="menu-icon" /> {isOpen && "Documentação"}</Link>
                        <Link to="/builders" className="menu-item"><FaComputer className="menu-icon" /> {isOpen && "Builders"}</Link>
                    </>
            </div>

            <div className="logout-container" onClick={handleLogout}>
                <FaSignOutAlt className="menu-icon" />
                {isOpen && <span>Logout</span>}
            </div>

        </div>
    );
};

export default Sidebar;
