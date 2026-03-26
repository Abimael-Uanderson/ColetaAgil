import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

const Solicitar: React.FC = () => {
  const [tipos, setTipos] = useState<any[]>([]);
  
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [imagemBase64, setImagemBase64] = useState("");

  useEffect(() => {
    api.get("/tipos-entulho").then(res => setTipos(res.data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleCriarSolicitacao() {
    try {
      await api.post("/solicitacoes", { 
        descricao, 
        endereco, 
        bairro, 
        tipo_entulho_id: Number(tipoId),
        imagem_url: imagemBase64 
      });
      alert("Solicitação enviada com sucesso!");
      
      setDescricao("");
      setEndereco("");
      setBairro("");
      setTipoId("");
      setImagemBase64("");
    } catch (err) { 
      alert("Erro ao criar solicitação"); 
    }
  }

  return (
    <div>
      <Header title="Nova Solicitação" />
      
      <div>
        <label>Tipo de Entulho:</label><br />
        <select value={tipoId} onChange={e => setTipoId(e.target.value)}>
          <option value="">Selecione</option>
          {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </div>

      <div>
        <label>Descrição:</label><br />
        <input 
          placeholder="Ex: Sofá velho e entulho de obra" 
          value={descricao} 
          onChange={e => setDescricao(e.target.value)} 
        />
      </div>

      <div>
        <label>Endereço:</label><br />
        <input 
          value={endereco} 
          onChange={e => setEndereco(e.target.value)} 
        />
      </div>

      <div>
        <label>Bairro:</label><br />
        <input 
          value={bairro} 
          onChange={e => setBairro(e.target.value)} 
        />
      </div>

      <div>
        <label>Carregar Foto:</label><br />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>

      {imagemBase64 && (
        <img src={imagemBase64} alt="Preview" style={{ width: '150px', marginTop: '10px', borderRadius: '8px' }} />
      )}

      <br />
      <button type="button" onClick={handleCriarSolicitacao}>
        Enviar Solicitação
      </button>
    </div>
  );
};

export default Solicitar;