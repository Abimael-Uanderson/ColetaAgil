import { response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";

const router = Router();

const usuarioRepo = AppDataSource.getRepository(Usuario);

router.get("/", async (request, response) => {
  try {
    const usuarios = await usuarioRepo.find();
    return response.json(usuarios);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao buscar usuários" });
  }
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

    return response.json(usuario);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao consultar usuário" });
  }
});

router.post("/", async (request, response) => {
  try {
    const { nome, email, telefone, senha } = request.body;

    const novoUsuario = usuarioRepo.create({
      nome,
      email,
      telefone,
      senha,
    });

    await usuarioRepo.save(novoUsuario);

    return response.status(201).json(novoUsuario);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao criar usuário" });
  }
});


router.post("/login", async (request,response) => {
  try{
    const { email, senha } =  request.body;

    if (!email || !senha) {
      return response.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const usuario = await usuarioRepo.findOneBy({ email});

    if(!usuario) {
      return response.status(404).json( {error: "Usuario não encontrado" });
    }

    if(usuario.senha !== senha) {
      return response.status(401).json({ error: "Senha inválida" });
    }

    const { senha: _, ...usuarioSemSenha } = usuario;

    return response.json({
      mensagem: "Login realizado com sucesso",
      usuario: usuarioSemSenha,
    });



  }catch(error) {
     return response.status(500).json({ erro: "Erro ao fazer login" });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const id = Number(request.params.id);

    const usuario = await usuarioRepo.findOneBy({ id });

    if (!usuario) {
      return response.status(404).json({ erro: "Usuário não encontrado" });
    }

    usuarioRepo.merge(usuario, request.body);

    await usuarioRepo.save(usuario);

    return response.json(usuario);
  } catch (error) {
    return response.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const id = Number(request.params.id);

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