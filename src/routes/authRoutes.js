const express = require('express');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'av2-secret-key';

function createAuthRoutes({ state, bcrypt }) {
  const router = express.Router();

  router.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
    }

    const usuarioExistente = state.usuarios.find((usuario) => usuario.email === email);

    if (usuarioExistente) {
      return res.status(409).json({ mensagem: 'Usuário já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = {
      id: state.nextUserId,
      nome,
      email,
      senha: senhaHash
    };

    state.usuarios.push(novoUsuario);
    state.nextUserId += 1;

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
  });

  router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const usuario = state.usuarios.find((item) => item.email === email);

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  });

  return router;
}

module.exports = { createAuthRoutes };
