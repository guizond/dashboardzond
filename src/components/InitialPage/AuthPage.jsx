import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Cadastro bem-sucedido!");
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