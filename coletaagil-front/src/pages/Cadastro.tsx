import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const navigate = useNavigate();

  async function handleCadastro() {
    try {
      await api.post("/usuarios", {
        nome,
        email,
        senha,
        telefone,
        tipo: "cidadao" 
      });
      alert("Conta criada com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao cadastrar usuário");
    }
  }

  return (
    <div>
      <h1>Criar Conta - ColetaÁgil</h1>
      <div>
        <input placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} />
      </div>
      <div>
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
      </div>
      <div>
        <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
      </div>
      <button type="button" onClick={handleCadastro}>Finalizar Cadastro</button>
      <br />
      <Link to="/">Já tenho uma conta</Link>
    </div>
  );
};

export default Cadastro;