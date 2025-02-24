import './sidebar.css';
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaCalendarAlt, FaQuestionCircle } from 'react-icons/fa';
import Calendar from '../Calendar/calendar';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className={`sidebar-container ${isOpen ? 'expanded' : 'collapsed'}`}>
            <div className="toggle-icon" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>

            <div className="content">
                    <>
                        <Link to="/" className="menu-item"><FaHome className="menu-icon" /> {isOpen && "Home"}</Link>
                        <Link to="/calendar" className="menu-item"><FaCalendarAlt className="menu-icon" /> {isOpen && "Calendário"}</Link>
                        <Link to="/faq" className="menu-item"><FaQuestionCircle className="menu-icon" /> {isOpen && "FAQ"}</Link>
                    </>
            </div>
        </div>
    );
};

export default Sidebar;
