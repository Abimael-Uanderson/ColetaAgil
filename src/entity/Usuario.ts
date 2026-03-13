import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Solicitacao } from "./Solicitacao"; 

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nome!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20 })
  telefone!: string;

  @Column({ type: "varchar", length: 255 })
  senha!: string;

  @OneToMany(() => Solicitacao, (solicitacao) => solicitacao.usuario)
  solicitacoes!: Solicitacao[];
}