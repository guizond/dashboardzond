import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import './Home.css'

const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    document.title = "Home";
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
  }, []);

  return (
    <div className="home-container">
      <h1>Bem-vindo {userName ? userName : "Usuário"}!</h1> 
      <p>Essa página ainda está em construção, estamos trabalhando para finalizá-la o quanto antes.</p>
    </div>
  );
};

export default Home;