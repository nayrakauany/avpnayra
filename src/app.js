const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');

const authMiddleware = require('./middlewares/authMiddleware');
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const { createAuthRoutes } = require('./routes/authRoutes');
const { createAviaoRoutes } = require('./routes/aviaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, '..', 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const state = {
  avioes: [
    { id: 1, modelo: 'Airbus A320', companhia: 'Latam', capacidade: 180 },
    { id: 2, modelo: 'Boeing 737', companhia: 'Gol', capacidade: 160 }
  ],
  usuarios: [],
  nextId: 3,
  nextUserId: 1
};

app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);
    const nomeArquivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;
    cb(null, nomeArquivo);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!tiposPermitidos.includes(file.mimetype)) {
      return cb(new Error('Tipo de arquivo inválido. Envie apenas PNG, JPG ou JPEG.'));
    }

    cb(null, true);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(createAuthRoutes({ state, bcrypt }));

app.post('/upload', authMiddleware, upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensagem: 'Arquivo não enviado.' });
  }

  return res.status(200).json({
    mensagem: 'Imagem enviada com sucesso.',
    arquivo: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

app.use('/avioes', authMiddleware);
app.use('/avioes', createAviaoRoutes({ state }));

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ mensagem: error.message });
  }

  if (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  return next();
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = { app, state, startServer };
