import express from "express";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());

const filmes = [
  { id: 1, titulo: "Interestelar", genero: "Ficção Científica", diretor: "Christopher Nolan", ano: 2014 },
  { id: 2, titulo: "O Rei Leão", genero: "Animação", diretor: "Jon Favreau", ano: 2019 },
  { id: 3, titulo: "Django Livre", genero: "Drama", diretor: "Quentin Tarantino", ano: 2012 },
  { id: 4, titulo: "A Origem", genero: "Ação", diretor: "Christopher Nolan", ano: 2010 },
  { id: 5, titulo: "Para Todos os Garotos que Já Amei", genero: "Romance", diretor: "Susan Johnson", ano: 2018 },
  { id: 6, titulo: "Vingadores: Ultimato", genero: "Ação", diretor: "Russo Brothers", ano: 2019 },
  { id: 7, titulo: "Whiplash", genero: "Drama Musical", diretor: "Damien Chazelle", ano: 2014 },
  { id: 8, titulo: "A Viagem de Chihiro", genero: "Animação", diretor: "Hayao Miyazaki", ano: 2001 }
];

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenSecreto = process.env.TOKEN_SECRETO;

  if (authHeader !== `Bearer ${tokenSecreto}`) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Token ausente ou inválido"
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    tema: "Filmes",
    categoria: "Catálogo de filmes"
  });
});

app.get("/filmes", autenticar, (req, res) => {
  res.json(filmes);
});

app.get("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  res.json(filme);
});

app.post("/filmes", autenticar, (req, res) => {
  const { titulo, genero, diretor, ano } = req.body;

  if (!titulo || !genero || !diretor || !ano) {
    return res.status(400).json({
      message: "Título, gênero, diretor e ano são obrigatórios"
    });
  }

  const novoFilme = {
    id: filmes.length + 1,
    titulo,
    genero,
    diretor,
    ano
  };

  filmes.push(novoFilme);

  res.status(201).json({
    mensagem: "Filme cadastrado com sucesso",
    filme: novoFilme
  });
});

app.patch("/filmes/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const { titulo, genero, diretor, ano } = req.body;

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  if (titulo) filme.titulo = titulo;
  if (genero) filme.genero = genero;
  if (diretor) filme.diretor = diretor;
  if (ano) filme.ano = ano;

  res.json(filme);
});

app.delete("/filmes/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);

  const filmeIndex = filmes.findIndex((filme) => filme.id === id);

  if (filmeIndex === -1) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  filmes.splice(filmeIndex, 1);

  res.json({
    message: "Filme removido com sucesso"
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
