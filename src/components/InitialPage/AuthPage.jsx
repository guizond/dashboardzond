import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login bem-sucedido!");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      console.log("Cadastro bem-sucedido! Nome salvo:", user.displayName);

      // Atualiza a página ou redireciona após o cadastro
      window.location.reload(); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left"></div>
      <div className="auth-right">
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
          {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
        </button>

        <div className="auth-form">
          <h2>{isLogin ? "Login" : "Cadastro"}</h2>

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="label-tittle">Nome:</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Insira seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="label-tittle">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Insira seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label-tittle">Senha:</label>
              <input
                type="password"
                id="password"
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;