import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";

const router = Router();
const usuarioRepo = AppDataSource.getRepository(Usuario);

router.get("/", async (request, response) => {
  try {
    const usuarios = await usuarioRepo.find();

    const usuariosSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);

    return response.json(usuariosSemSenha);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

router.post("/", async (request, response) => {
  try {
    const { nome, email, telefone, senha, tipo } = request.body;

    const novoUsuario = usuarioRepo.create({
      nome,
      email,
      telefone,
      senha,
      tipo,
    });

    await usuarioRepo.save(novoUsuario);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return response.status(201).json(usuarioSemSenha);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao criar usuário" });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, senha } = request.body;

    if (!email || !senha) {
      return response.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const usuario = await usuarioRepo.findOneBy({ email });

    if (!usuario) {
      return response.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (usuario.senha !== senha) {
      return response.status(401).json({ erro: "Senha inválida" });
    }

    const session = request.session as any;
    session.usuarioLogado = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    };

    const { senha: _, ...usuarioSemSenha } = usuario;

    return response.json({
      mensagem: "Login realizado com sucesso",
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao fazer login" });
  }
});

router.post("/logout", (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return response.status(500).json({ erro: "Não foi possível deslogar" });
    }

    response.clearCookie("connect.sid");
    return response.json({ mensagem: "Logout realizado com sucesso" });
  });
});

router.get("/me", (request, response) => {
  const session = request.session as any;

  if (session.usuarioLogado) {
    return response.json(session.usuarioLogado);
  }

  return response.status(401).json({ erro: "Não autenticado" });
});

router.get("/:id", async (request, response) => {
  try {
    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const usuario = await usuarioRepo.findOneBy({ id });

    if (!usuario) {
      return response.status(404).json({ erro: "Usuário não encontrado" });
    }

    const { senha: _, ...usuarioSemSenha } = usuario;

    return response.json(usuarioSemSenha);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao consultar usuário" });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const usuario = await usuarioRepo.findOneBy({ id });

    if (!usuario) {
      return response.status(404).json({ erro: "Usuário não encontrado" });
    }

    usuarioRepo.merge(usuario, request.body);
    await usuarioRepo.save(usuario);

    const { senha: _, ...usuarioSemSenha } = usuario;

    return response.json(usuarioSemSenha);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const id = Number(request.params.id);

    if (isNaN(id)) {
      return response.status(400).json({ erro: "ID inválido" });
    }

    const usuario = await usuarioRepo.findOneBy({ id });

    if (!usuario) {
      return response.status(404).json({ erro: "Usuário não encontrado" });
    }

    await usuarioRepo.remove(usuario);

    return response.json({ mensagem: "Usuário removido com sucesso" });
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao remover usuário" });
  }
});

export default router;