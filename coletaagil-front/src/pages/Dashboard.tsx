import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/usuarios/me")
      .then(response => setUsuario(response.data))
      .catch(() => navigate("/")); 
  }, [navigate]);

  async function handleLogout() {
    try {
      await api.post("/usuarios/logout");
      navigate("/");
    } catch (error) {
      alert("Erro ao sair do sistema");
    }
  }

  return (
    <div>

      <Header title="Dashboard" tipoUsuario={usuario?.tipo} />

      {usuario && (
        <>
          <h2>Bem-vindo, {usuario.nome}</h2>
          <p>Você está logado como: <strong>{usuario.tipo.toUpperCase()}</strong></p>

          <hr style={{ margin: "20px 0" }} />

     
          {usuario.tipo === "admin" ? (
            <div style={{ background: "#e3f2fd", padding: "20px", borderRadius: "8px" }}>
              <h3>Painel de Gestão Operacional</h3>
              <p>Como administrador, você pode gerenciar a logística de coleta da cidade.</p>
              <ul>
                <li>Verificar novas solicitações de entulho pendentes.</li>
                <li>Organizar o cronograma de agendamentos por turno.</li>
                <li>Cadastrar ou remover tipos de materiais permitidos.</li>
              </ul>
              <div style={{ marginTop: "15px" }}>
                <Link to="/admin/agendamentos">
                  <button type="button">Ir para Agendamentos</button>
                </Link>
              </div>
            </div>
          ) : (
            
            <div style={{ background: "#f1f8e9", padding: "20px", borderRadius: "8px" }}>
              <h3>Área do Cidadão</h3>
              <p>Precisa descartar entulho de forma correta?</p>
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <Link to="/solicitar">
                  <button type="button">Nova Solicitação</button>
                </Link>
                <Link to="/minhas-solicitacoes">
                  <button type="button" style={{ background: "#666" }}>Ver Meus Pedidos</button>
                </Link>
              </div>
            </div>
          )}

          <div style={{ marginTop: "30px" }}>
            <button onClick={handleLogout} style={{ background: "#d32f2f", color: "white" }}>
              Sair do Sistema
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;