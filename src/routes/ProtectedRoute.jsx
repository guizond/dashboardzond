import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Carregando...</div>; // Evita redirecionamento antes da checagem
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/authpage" />;
};

export default ProtectedRoute;