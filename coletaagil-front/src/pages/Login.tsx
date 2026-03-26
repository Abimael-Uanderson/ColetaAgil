import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import api from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      await api.post("/usuarios/login", { email, senha });
      
      
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  }

  return (
    <div>
      <h1>Login - ColetaÁgil</h1>
      
      <div>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
      </div>

      <div>
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={e => setSenha(e.target.value)} 
        />
      </div>

      <button type="button" onClick={handleLogin}>Entrar</button>

      <div style={{ marginTop: "15px" }}>
        <p>Não tem uma conta? <Link to="/cadastrar">Cadastre-se aqui</Link></p>
      </div>
    </div>
  );
};

export default Login;