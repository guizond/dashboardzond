import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import './Home.css'
import PostSection from "../../components/PostSection/PostSection";
import GeneralNotifications from "../../components/GeneralNotifications/GeneralNotifications";
import UserNotifications from "../../components/UserNotifications/UserNotifications";
import { onAuthStateChanged } from "firebase/auth";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Home";

    // Ouvinte para mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Limpa o ouvinte ao desmontar o componente
  }, []);

  return (
    <div>
      {user ? (
        <PostSection userId={user.uid} />
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default Home;