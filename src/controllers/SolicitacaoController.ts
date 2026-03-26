import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Solicitacao, StatusSolicitacao } from "../entity/Solicitacao";
import { TipoEntulho } from "../entity/TipoEntulho";

const router = Router();
const solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
const tipoEntulhoRepo = AppDataSource.getRepository(TipoEntulho);

router.post("/", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Faça login para solicitar" });
    }

    const { descricao, endereco, bairro, tipo_entulho_id, imagem_url } = request.body;

    if (!descricao || !endereco || !bairro || !tipo_entulho_id) {
      return response.status(400).json({ erro: "Preencha os campos obrigatórios" });
    }

    const tipoEntulho = await tipoEntulhoRepo.findOneBy({ id: Number(tipo_entulho_id) });

    if (!tipoEntulho) {
      return response.status(404).json({ erro: "Tipo de entulho não encontrado" });
    }

    const novaSolicitacao = solicitacaoRepo.create({
      descricao,
      endereco,
      bairro,
      imagem_url,
      status: StatusSolicitacao.PENDENTE,
      usuario: { id: session.usuarioLogado.id },
      tipo_entulho: tipoEntulho
    });

    await solicitacaoRepo.save(novaSolicitacao);

    return response.status(201).json(novaSolicitacao);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao criar solicitação" });
  }
});

router.get("/", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autorizado" });
    }

    let solicitacoes;

    if (session.usuarioLogado.tipo === "admin") {
      solicitacoes = await solicitacaoRepo.find({
        relations: ["usuario", "tipo_entulho"]
      });
    } else {
      solicitacoes = await solicitacaoRepo.find({
        where: { usuario: { id: session.usuarioLogado.id } },
        relations: ["tipo_entulho"]
      });
    }

    return response.json(solicitacoes);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao buscar solicitações" });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autorizado" });
    }

    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const solicitacao = await solicitacaoRepo.findOne({
      where: { id },
      relations: ["usuario", "tipo_entulho"]
    });

    if (!solicitacao) {
      return response.status(404).json({ erro: "Solicitação não encontrada" });
    }

    const ehAdmin = session.usuarioLogado.tipo === "admin";
    const ehDono = solicitacao.usuario.id === session.usuarioLogado.id;

    if (!ehAdmin && !ehDono) {
      return response.status(403).json({ erro: "Acesso negado" });
    }

    return response.json(solicitacao);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao buscar solicitação" });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autorizado" });
    }

    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const solicitacao = await solicitacaoRepo.findOne({
      where: { id },
      relations: ["usuario", "tipo_entulho"]
    });

    if (!solicitacao) {
      return response.status(404).json({ erro: "Solicitação não encontrada" });
    }

    const ehAdmin = session.usuarioLogado.tipo === "admin";
    const ehDono = solicitacao.usuario.id === session.usuarioLogado.id;

    if (!ehAdmin && !ehDono) {
      return response.status(403).json({ erro: "Acesso negado" });
    }

    const { descricao, endereco, bairro, imagem_url, tipo_entulho_id, status } = request.body;

    if (descricao !== undefined) solicitacao.descricao = descricao;
    if (endereco !== undefined) solicitacao.endereco = endereco;
    if (bairro !== undefined) solicitacao.bairro = bairro;
    if (imagem_url !== undefined) solicitacao.imagem_url = imagem_url;

    if (tipo_entulho_id !== undefined) {
      const tipoEntulho = await tipoEntulhoRepo.findOneBy({ id: Number(tipo_entulho_id) });

      if (!tipoEntulho) {
        return response.status(404).json({ erro: "Tipo de entulho não encontrado" });
      }

      solicitacao.tipo_entulho = tipoEntulho;
    }

    if (status !== undefined) {
      if (!ehAdmin) {
        return response.status(403).json({ erro: "Somente admin pode alterar o status" });
      }

      solicitacao.status = status;
    }

    await solicitacaoRepo.save(solicitacao);

    return response.json(solicitacao);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao atualizar solicitação" });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autorizado" });
    }

    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const solicitacao = await solicitacaoRepo.findOne({
      where: { id },
      relations: ["usuario"]
    });

    if (!solicitacao) {
      return response.status(404).json({ erro: "Solicitação não encontrada" });
    }

    const ehAdmin = session.usuarioLogado.tipo === "admin";
    const ehDono = solicitacao.usuario.id === session.usuarioLogado.id;

    if (!ehAdmin && !ehDono) {
      return response.status(403).json({ erro: "Acesso negado" });
    }

    if (!ehAdmin && solicitacao.status !== StatusSolicitacao.PENDENTE) {
      return response.status(403).json({
        erro: "Você só pode excluir solicitações pendentes"
      });
    }

    await solicitacaoRepo.remove(solicitacao);

    return response.json({ mensagem: "Solicitação removida com sucesso" });
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao remover solicitação" });
  }
});

export default router;