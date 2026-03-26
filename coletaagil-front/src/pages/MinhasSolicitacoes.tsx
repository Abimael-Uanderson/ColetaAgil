import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";


type Solicitacao = {
  id: number;
  descricao: string;
  endereco: string;
  bairro: string;
  status: string;
  imagem_url: string; 
  tipo_entulho: { nome: string };
};

const MinhasSolicitacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  useEffect(() => {
    api.get("/solicitacoes").then((response) => {
      setSolicitacoes(response.data);
    });
  }, []);

  return (
    <div>
      <Header title="Minhas Solicitações" />
      <ul>
        {solicitacoes.map((s) => (
          <li key={s.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}>
            <strong>{s.tipo_entulho?.nome}</strong> - {s.status}
            <p>{s.descricao}</p>
            
            {s.imagem_url && (
              <div style={{ marginTop: "10px" }}>
                <img 
                  src={s.imagem_url} 
                  alt="Foto do entulho" 
                  style={{ width: "200px", borderRadius: "8px" }} 
                />
              </div>
            )}
            
            <p><small>{s.endereco}, {s.bairro}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MinhasSolicitacoes;