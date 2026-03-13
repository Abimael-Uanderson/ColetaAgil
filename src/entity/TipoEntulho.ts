import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Solicitacao } from "./Solicitacao";

@Entity("tipos_entulho")
export class TipoEntulho {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  nome!: string;

  @Column({ type: "varchar", length: 255 })
  descricao!: string;

  @OneToMany(() => Solicitacao, (solicitacao) => solicitacao.tipo_entulho)
  solicitacoes!: Solicitacao[];
}