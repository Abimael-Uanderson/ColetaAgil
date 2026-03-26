import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { TipoEntulho } from "./TipoEntulho";
import { Agendamento } from "./Agendamento";
import { OneToMany } from "typeorm";

export enum StatusSolicitacao {
  PENDENTE = "pendente",
  EM_ANDAMENTO = "em_andamento",
  CONCLUIDA = "concluida",
  CANCELADA = "cancelada"
}

@Entity("solicitacoes")
export class Solicitacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  descricao!: string;

  @Column({ type: "varchar", length: 200 })
  endereco!: string;

  @Column({ type: "varchar", length: 100 })
  bairro!: string;

  @Column({ type: "text", nullable: true })
  imagem_url!: string;

  @Column({
    type: "enum",
    enum: StatusSolicitacao,
    default: StatusSolicitacao.PENDENTE
  })
  status!: StatusSolicitacao;


  @CreateDateColumn({ type: "timestamp" })
  data_solicitacao!: Date;


  @ManyToOne(() => Usuario, (usuario) => usuario.solicitacoes)
  @JoinColumn({ name: "usuario_id" }) 
  usuario!: Usuario;

  @ManyToOne(() => TipoEntulho)
  @JoinColumn({ name: "tipo_entulho_id" })
  tipo_entulho!: TipoEntulho;

  @OneToMany(() => Agendamento, (agendamento) => agendamento.solicitacao)
  agendamentos!: Agendamento[];
}