import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import AuthPage from "../components/InitialPage/AuthPage";
import Header from "../components/Header/header";
import Sidebar from "../components/Sidebar/sidebar";
import Home from "../Pages/Home/Home";
import CalendarPage from "../Pages/CalendarPage/CalendarPage";
import FAQPage from "../Pages/FaqPage/FAQPage";
import MainLayout from "../components/MainLayout";
import { auth } from "../firebaseConfig";
import ProtectedRoute from "./ProtectedRoute";
import BuildersPage from "../Pages/BuildersPage/BuildersPage";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Header />}
      {isAuthenticated && <Sidebar />}
      <div className="content-container">
        <Routes>
          <Route path="/authpage" element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} />

          <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/docs" element={<FAQPage />} />
              <Route path="/builders" element={<BuildersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/authpage" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;