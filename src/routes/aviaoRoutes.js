const express = require('express');

function createAviaoRoutes({ state }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.status(200).json(state.avioes);
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const aviao = state.avioes.find((item) => item.id === id);

    if (!aviao) {
      return res.status(404).json({ mensagem: 'Avião não encontrado.' });
    }

    return res.status(200).json(aviao);
  });

  router.post('/', (req, res) => {
    const { modelo, companhia, capacidade } = req.body;

    if (!modelo || !companhia || typeof capacidade !== 'number') {
      return res.status(400).json({ mensagem: 'Modelo, companhia e capacidade são obrigatórios.' });
    }

    const novoAviao = {
      id: state.nextId,
      modelo,
      companhia,
      capacidade
    };

    state.avioes.push(novoAviao);
    state.nextId += 1;

    return res.status(201).json(novoAviao);
  });

  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const aviaoIndex = state.avioes.findIndex((item) => item.id === id);

    if (aviaoIndex === -1) {
      return res.status(404).json({ mensagem: 'Avião não encontrado.' });
    }

    const { modelo, companhia, capacidade } = req.body;

    if (!modelo || !companhia || typeof capacidade !== 'number') {
      return res.status(400).json({ mensagem: 'Modelo, companhia e capacidade são obrigatórios.' });
    }

    state.avioes[aviaoIndex] = {
      ...state.avioes[aviaoIndex],
      modelo,
      companhia,
      capacidade
    };

    return res.status(200).json(state.avioes[aviaoIndex]);
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const aviaoIndex = state.avioes.findIndex((item) => item.id === id);

    if (aviaoIndex === -1) {
      return res.status(404).json({ mensagem: 'Avião não encontrado.' });
    }

    const [aviaoRemovido] = state.avioes.splice(aviaoIndex, 1);

    return res.status(200).json({
      mensagem: 'Avião removido com sucesso.',
      aviao: aviaoRemovido
    });
  });

  return router;
}

module.exports = { createAviaoRoutes };
