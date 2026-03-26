import { Router } from "express";
import { AppDataSource } from "../data-source";
import { TipoEntulho } from "../entity/TipoEntulho";
import { TipoUsuario } from "../entity/Usuario";

const router = Router();
const tipoEntulhoRepo = AppDataSource.getRepository(TipoEntulho);

const isAdmin = (session: any) => {
  return session.usuarioLogado && (
    session.usuarioLogado.tipo === "admin" || 
    session.usuarioLogado.tipo === TipoUsuario.ADMIN
  );
};

router.get("/", async (request, response) => {
  try {
    const session = request.session as any;
    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autenticado" });
    }

    const tiposEntulho = await tipoEntulhoRepo.find();
    return response.json(tiposEntulho);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao buscar tipos de entulho" });
  }
});

router.post("/", async (request, response) => {
  try {
    const session = request.session as any;

    if (!session.usuarioLogado) {
      return response.status(401).json({ erro: "Não autenticado" });
    }

    if (!isAdmin(session)) {
      return response.status(403).json({ erro: "Apenas admin pode criar tipos de entulho" });
    }

    const { nome, descricao } = request.body;

    if (!nome || !descricao) {
      return response.status(400).json({ erro: "Nome e descrição são obrigatórios" });
    }

    const novoTipoEntulho = tipoEntulhoRepo.create({ nome, descricao });
    await tipoEntulhoRepo.save(novoTipoEntulho);

    return response.status(201).json(novoTipoEntulho);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao criar tipo de entulho" });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const session = request.session as any;
    if (!isAdmin(session)) {
      return response.status(403).json({ erro: "Apenas admin pode atualizar tipos de entulho" });
    }

    const id = Number(request.params.id);
    const tipoEntulho = await tipoEntulhoRepo.findOneBy({ id });

    if (!tipoEntulho) {
      return response.status(404).json({ erro: "Tipo de entulho não encontrado" });
    }

    const { nome, descricao } = request.body;
    if (nome !== undefined) tipoEntulho.nome = nome;
    if (descricao !== undefined) tipoEntulho.descricao = descricao;

    await tipoEntulhoRepo.save(tipoEntulho);
    return response.json(tipoEntulho);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao atualizar tipo de entulho" });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const session = request.session as any;
    if (!isAdmin(session)) {
      return response.status(403).json({ erro: "Apenas admin pode remover tipos de entulho" });
    }

    const id = Number(request.params.id);
    const tipoEntulho = await tipoEntulhoRepo.findOneBy({ id });

    if (!tipoEntulho) {
      return response.status(404).json({ erro: "Tipo de entulho não encontrado" });
    }

    await tipoEntulhoRepo.remove(tipoEntulho);
    return response.json({ mensagem: "Tipo de entulho removido com sucesso" });
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao remover tipo de entulho" });
  }
});

export default router;