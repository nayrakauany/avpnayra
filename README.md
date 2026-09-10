# API de Cadastro de Aviões

API em Node.js com Express para cadastro de usuários, autenticação, CRUD de aviões em memória, upload de imagens e documentação Swagger.

## Tecnologias

- Node.js
- Express
- JavaScript
- bcrypt
- jsonwebtoken
- multer
- swagger-jsdoc
- swagger-ui-express

## Estrutura do projeto

```text
.
├── server.js
├── src/
│   ├── app.js
│   ├── config/
│   │   └── swagger.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   └── routes/
│       ├── authRoutes.js
│       └── aviaoRoutes.js
├── uploads/
├── package.json
├── README.md
└── server.test.js
```

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

O servidor será iniciado em:

```text
http://localhost:3000
```

## Documentação Swagger

A documentação está disponível em:

```text
http://localhost:3000/api-docs
```

## Rotas da API

### Usuários

#### POST /usuarios
Cria um novo usuário.

Body exemplo:

```json
{
  "nome": "Ana",
  "email": "ana@email.com",
  "senha": "123456"
}
```

#### POST /login
Faz login e retorna um token JWT.

Body exemplo:

```json
{
  "email": "ana@email.com",
  "senha": "123456"
}
```

Resposta exemplo:

```json
{
  "mensagem": "Login realizado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Ana",
    "email": "ana@email.com"
  }
}
```

### Aviões (protegidas)

Todas as rotas abaixo exigem o header:

```http
Authorization: Bearer SEU_TOKEN
```

#### GET /avioes
Lista todos os aviões.

#### GET /avioes/:id
Consulta um avião específico pelo ID.

#### POST /avioes
Cadastra um novo avião.

Body exemplo:

```json
{
  "modelo": "Embraer E190",
  "companhia": "Azul",
  "capacidade": 120
}
```

#### PUT /avioes/:id
Atualiza um avião existente.

#### DELETE /avioes/:id
Exclui um avião pelo ID.

### Upload

#### POST /upload
Envia uma imagem para a pasta local `uploads`.

Requisição via formulário multipart:

- campo: `imagem`

Tipos permitidos:
- PNG
- JPG
- JPEG

Tamanho máximo:
- 2 MB

### Testes

```bash
npm test
```

## Observações

- Os dados são armazenados em memória, então são perdidos ao reiniciar o servidor.
- As senhas são armazenadas em hash com bcrypt.
- O Swagger facilita a visualização das rotas e a documentação da API.
