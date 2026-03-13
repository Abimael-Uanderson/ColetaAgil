import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

import usuarioController from "./controllers/usuarioController";

const app = express();

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado");

    app.use("/usuarios", usuarioController);

    app.listen(3333, () => {
      console.log("Servidor rodando na porta 3333");
    });
  })
  .catch((error) => console.log("Erro fatal no banco:", error));