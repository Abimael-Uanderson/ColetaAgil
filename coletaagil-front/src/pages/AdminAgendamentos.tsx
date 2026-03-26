import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

type Solicitacao = {
  id: number;
  descricao: string;
  endereco: string;
  bairro: string;
  status: string;
  usuario: { nome: string };
  tipo_entulho: { nome: string };
};

type Agendamento = {
  id: number;
  data_coleta: string;
  turno: string;
  realizado: boolean;
  solicitacao: Solicitacao;
};

const AdminAgendamentos: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dataColeta, setDataColeta] = useState("");
  const [turno, setTurno] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const resSoli = await api.get("/solicitacoes");
      setSolicitacoes(resSoli.data.filter((s: Solicitacao) => s.status === "PENDENTE"));

      const resAgen = await api.get("/agendamentos");
      setAgendamentos(resAgen.data);
    } catch (error) {
      alert("Erro ao carregar dados");
    }
  }

  async function handleCriarAgendamento() {
    try {
      await api.post("/agendamentos", {
        solicitacao_id: selectedId,
        data_coleta: dataColeta,
        turno,
      });
      setSelectedId(null);
      carregarDados();
    } catch (error) {
      alert("Erro ao agendar");
    }
  }

  async function handleConcluirAgendamento(id: number) {
    try {
      await api.put(`/agendamentos/${id}`, { realizado: true });
      carregarDados();
    } catch (error) {
      alert("Erro ao concluir agendamento");
    }
  }

  return (
    <div>
      <Header title="Gestão de Coletas" tipoUsuario="admin" />

      <h2>1. Solicitações Pendentes</h2>
      <ul>
        {solicitacoes.map((s) => (
          <li key={s.id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
            {s.usuario.nome} - {s.bairro} ({s.tipo_entulho.nome})
            <button type="button" onClick={() => setSelectedId(s.id)}>Agendar</button>
            
            {selectedId === s.id && (
              <div style={{ marginTop: "10px", background: "#f9f9f9", padding: "5px" }}>
                <input type="date" value={dataColeta} onChange={(e) => setDataColeta(e.target.value)} />
                <select value={turno} onChange={(e) => setTurno(e.target.value)}>
                  <option value="">Turno</option>
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                </select>
                <button type="button" onClick={handleCriarAgendamento}>Confirmar</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <hr />

      <h2>2. Cronograma de Coletas (Agendados)</h2>
      <table border={1} style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Turno</th>
            <th>Bairro</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((a) => (
            <tr key={a.id}>
              <td>{new Date(a.data_coleta).toLocaleDateString('pt-BR')}</td>
              <td>{a.turno}</td>
              <td>{a.solicitacao?.bairro}</td>
              <td>{a.realizado ? "✅ Concluído" : "⏳ Em aberto"}</td>
              <td>
                {!a.realizado && (
                  <button type="button" onClick={() => handleConcluirAgendamento(a.id)}>
                    Marcar Concluído
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAgendamentos;