import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

type TipoEntulho = {
  id: number;
  nome: string;
  descricao: string;
};

const AdminTipos: React.FC = () => {
  const [tipos, setTipos] = useState<TipoEntulho[]>([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    carregarTipos();
  }, []);

  async function carregarTipos() {
    try {
      const response = await api.get("/tipos-entulho");
      setTipos(response.data);
    } catch (error) {
      alert("Erro ao carregar tipos");
    }
  }

  async function handleCriarTipo() {
    try {
      await api.post("/tipos-entulho", {
        nome,
        descricao,
      });

      setNome("");
      setDescricao("");
      carregarTipos();
    } catch (error) {
      alert("Erro ao criar tipo");
    }
  }

  async function handleExcluirTipo(id: number) {
    try {
      await api.delete(`/tipos-entulho/${id}`);
      carregarTipos();
    } catch (error) {
      alert("Erro ao excluir tipo");
    }
  }

  return (
    <div>
      <Header title="Tipos de Entulho" tipoUsuario="admin" />

      <h2>Novo Tipo</h2>

      <div>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <button type="button" onClick={handleCriarTipo}>
        Cadastrar Tipo
      </button>

      <h2>Lista de Tipos</h2>

      <ul>
        {tipos.map((tipo) => (
          <li key={tipo.id}>
            <strong>{tipo.nome}</strong> - {tipo.descricao}{" "}
            <button type="button" onClick={() => handleExcluirTipo(tipo.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTipos;