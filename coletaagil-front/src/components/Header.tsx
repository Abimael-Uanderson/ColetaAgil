import React from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
  title: string;
  tipoUsuario?: string; 
};

const Header: React.FC<HeaderProps> = ({ title, tipoUsuario }) => {
  return (
    <header>
      <h1>{title}</h1>

      <nav>
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/perfil">Meu Perfil</Link>
        
        {tipoUsuario === "cidadao" && (
          <>
            | <Link to="/solicitar">Solicitar</Link> |{" "}
            <Link to="/minhas-solicitacoes">Minhas Solicitações</Link>
          </>
        )}
        
        {tipoUsuario === "admin" && (
          <>
            | <Link to="/admin/tipos-entulho">Tipos de Entulho</Link> |{" "}
            <Link to="/admin/agendamentos">Agendamentos</Link>
          </>
        )}
      </nav>

      <hr />
    </header>
  );
};

export default Header;