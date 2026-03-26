import "reflect-metadata";
import express from "express";
import cors from "cors"; //
import session from "express-session";
import { AppDataSource } from "./data-source";

import usuarioController from "./controllers/UsuarioController";
import solicitacaoController from "./controllers/SolicitacaoController";
import agendamentoController from "./controllers/AgendamentoController";
import tipoEntulhoController from "./controllers/TipoEntulhoController";

const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));

app.use(
  session({
    secret: "senha123", 
    resave: false,                         
    saveUninitialized: false,              
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,         
      secure: false, 
      httpOnly: true,                      
    },
  })
);

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado");
    
    
    app.use("/usuarios", usuarioController);
    app.use("/solicitacoes", solicitacaoController);
    app.use("/agendamentos", agendamentoController);
    app.use("/tipos-entulho", tipoEntulhoController);

    app.listen(3333, () => {
      console.log("Servidor rodando na porta 3333");
    });
  })
  .catch((error) => console.log("Erro fatal no banco:", error));