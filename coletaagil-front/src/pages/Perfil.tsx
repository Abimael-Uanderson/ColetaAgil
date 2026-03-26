import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

const Perfil: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/usuarios/me").then(res => {
      setNome(res.data.nome);
      setEmail(res.data.email);
      setTipo(res.data.tipo);
    }).catch(() => navigate("/"));
  }, [navigate]);

  async function handleUpdate() {
    try {
      await api.put("/usuarios/perfil", { nome, email });
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar perfil");
    }
  }

  async function handleDelete() {
    if (window.confirm("ATENÇÃO: Deseja realmente excluir sua conta? Esta ação é irreversível.")) {
      try {
        await api.delete("/usuarios/perfil");
        navigate("/");
      } catch (err) {
        alert("Erro ao excluir conta");
      }
    }
  }

  return (
    <div>
      <Header title="Meu Perfil" tipoUsuario={tipo} />
      <h2>Gerenciar Dados</h2>
      <div>
        <label>Nome:</label><br />
        <input value={nome} onChange={e => setNome(e.target.value)} />
      </div>
      <div>
        <label>E-mail:</label><br />
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      
      <button type="button" onClick={handleUpdate}>Salvar Alterações</button>
      
      <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
        <button 
          type="button" 
          onClick={handleDelete} 
          style={{ background: "#ff4444", color: "white" }}
        >
          Excluir minha conta permanentemente
        </button>
      </div>
    </div>
  );
};

export default Perfil;