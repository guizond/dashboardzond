import React, { useState } from 'react';
import Sidebar from './Sidebar/sidebar';
import Calendar from './Calendar/Calendar/Calendar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="content-main">
        <Calendar isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default MainLayout;