import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Solicitar from "../pages/Solicitar";
import MinhasSolicitacoes from "../pages/MinhasSolicitacoes";
import AdminTipos from "../pages/AdminTipos";
import AdminAgendamentos from "../pages/AdminAgendamentos";
import Cadastro from "../pages/Cadastro";
import Perfil from "../pages/Perfil";

const RoutesApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/cadastrar" element={<Cadastro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/solicitar" element={<Solicitar />} />
      <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
      <Route path="/admin/tipos-entulho" element={<AdminTipos />} />
      <Route path="/admin/agendamentos" element={<AdminAgendamentos />} />
    </Routes>
  );
};

export default RoutesApp;