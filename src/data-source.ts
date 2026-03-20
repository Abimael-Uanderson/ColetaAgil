import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Usuario } from "./entity/Usuario";
import { Solicitacao } from "./entity/Solicitacao";
import { TipoEntulho } from "./entity/TipoEntulho";
import { Agendamento } from "./entity/Agendamento";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Usuario, Solicitacao, TipoEntulho, Agendamento],
  ssl: {
    rejectUnauthorized: false,
  },
});