import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Agendamento } from "../entity/Agendamento";
import { Solicitacao, StatusSolicitacao } from "../entity/Solicitacao";
import { TipoUsuario } from "../entity/Usuario";

const router = Router();

const agendamentoRepo = AppDataSource.getRepository(Agendamento);
const solicitacaoRepo = AppDataSource.getRepository(Solicitacao);

router.post("/", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autenticado" });
    }

    if (session.usuarioLogado.tipo !== TipoUsuario.ADMIN) {
      return response.status(403).json({ erro: "Apenas admin pode criar agendamentos" });
    }

    const { data_coleta, turno, solicitacao_id } = request.body;

    if (!data_coleta || !turno || !solicitacao_id) {
      return response.status(400).json({ erro: "Preencha os campos obrigatórios" });
    }

    const solicitacao = await solicitacaoRepo.findOne({
      where: { id: Number(solicitacao_id) },
      relations: ["usuario", "tipo_entulho"]
    });

    if (!solicitacao) {
      return response.status(404).json({ erro: "Solicitação não encontrada" });
    }

    const novoAgendamento = agendamentoRepo.create({
      data_coleta,
      turno,
      realizado: false,
      solicitacao
    });

    await agendamentoRepo.save(novoAgendamento);

    solicitacao.status = StatusSolicitacao.EM_ANDAMENTO;
    await solicitacaoRepo.save(solicitacao);

    return response.status(201).json(novoAgendamento);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao criar agendamento" });
  }
});

router.get("/", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autenticado" });
    }

    let agendamentos;

    if (session.usuarioLogado.tipo === TipoUsuario.ADMIN) {
      agendamentos = await agendamentoRepo.find({
        relations: ["solicitacao", "solicitacao.usuario", "solicitacao.tipo_entulho"]
      });
    } else {
      agendamentos = await agendamentoRepo.find({
        relations: ["solicitacao", "solicitacao.usuario", "solicitacao.tipo_entulho"]
      });

      agendamentos = agendamentos.filter(
        (agendamento) => agendamento.solicitacao.usuario.id === session.usuarioLogado.id
      );
    }

    return response.json(agendamentos);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao buscar agendamentos" });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autenticado" });
    }

    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const agendamento = await agendamentoRepo.findOne({
      where: { id },
      relations: ["solicitacao", "solicitacao.usuario", "solicitacao.tipo_entulho"]
    });

    if (!agendamento) {
      return response.status(404).json({ erro: "Agendamento não encontrado" });
    }

    const ehAdmin = session.usuarioLogado.tipo === TipoUsuario.ADMIN;
    const ehDono = agendamento.solicitacao.usuario.id === session.usuarioLogado.id;

    if (!ehAdmin && !ehDono) {
      return response.status(403).json({ erro: "Acesso negado" });
    }

    return response.json(agendamento);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao buscar agendamento" });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autenticado" });
    }

    if (session.usuarioLogado.tipo !== TipoUsuario.ADMIN) {
      return response.status(403).json({ erro: "Apenas admin pode atualizar agendamentos" });
    }

    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const agendamento = await agendamentoRepo.findOne({
      where: { id },
      relations: ["solicitacao"]
    });

    if (!agendamento) {
      return response.status(404).json({ erro: "Agendamento não encontrado" });
    }

    const { data_coleta, turno, realizado } = request.body;

    if (data_coleta !== undefined) agendamento.data_coleta = data_coleta;
    if (turno !== undefined) agendamento.turno = turno;
    if (realizado !== undefined) agendamento.realizado = realizado;

    await agendamentoRepo.save(agendamento);

    if (agendamento.realizado === true) {
      agendamento.solicitacao.status = StatusSolicitacao.CONCLUIDA;
    } else {
      agendamento.solicitacao.status = StatusSolicitacao.EM_ANDAMENTO;
    }

    await solicitacaoRepo.save(agendamento.solicitacao);

    return response.json(agendamento);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao atualizar agendamento" });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autenticado" });
    }

    if (session.usuarioLogado.tipo !== TipoUsuario.ADMIN) {
      return response.status(403).json({ erro: "Apenas admin pode remover agendamentos" });
    }

    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const agendamento = await agendamentoRepo.findOne({
      where: { id },
      relations: ["solicitacao"]
    });

    if (!agendamento) {
      return response.status(404).json({ erro: "Agendamento não encontrado" });
    }

    await agendamentoRepo.remove(agendamento);

    agendamento.solicitacao.status = StatusSolicitacao.PENDENTE;
    await solicitacaoRepo.save(agendamento.solicitacao);

    return response.json({ mensagem: "Agendamento removido com sucesso" });
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao remover agendamento" });
  }
});

export default router;