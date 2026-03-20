import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Solicitacao } from "./Solicitacao";

export enum TurnoColeta {
  MANHA = "manha",
  TARDE = "tarde"
}

@Entity("agendamentos")
export class Agendamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date" })
  data_coleta!: Date;

  @Column({
    type: "enum",
    enum: TurnoColeta
  })
  turno!: TurnoColeta;

  @Column({ type: "boolean", default: false })
  realizado!: boolean;

  @ManyToOne(() => Solicitacao, (solicitacao) => solicitacao.agendamentos)
  @JoinColumn({ name: "solicitacao_id" })
  solicitacao!: Solicitacao;
}