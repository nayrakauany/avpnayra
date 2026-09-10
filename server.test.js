const test = require('node:test');
const assert = require('node:assert/strict');
const { app, usuarios } = require('./server.js');

test('AV2: cadastro, login e proteção de rotas', async () => {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  try {
    let response = await fetch(`${baseUrl}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Ana', email: 'ana@email.com', senha: '123456' })
    });
    assert.equal(response.status, 201);

    response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ana@email.com', senha: '123456' })
    });
    assert.equal(response.status, 200);
    const login = await response.json();
    assert.ok(login.token);

    response = await fetch(`${baseUrl}/avioes`);
    assert.equal(response.status, 401);

    response = await fetch(`${baseUrl}/avioes`, {
      headers: { Authorization: `Bearer ${login.token}` }
    });
    assert.equal(response.status, 200);

    const before = await response.json();
    const lengthBefore = before.length;

    response = await fetch(`${baseUrl}/avioes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`
      },
      body: JSON.stringify({ modelo: 'Embraer E190', companhia: 'Azul', capacidade: 120 })
    });
    assert.equal(response.status, 201);
    const created = await response.json();
    assert.equal(created.modelo, 'Embraer E190');

    response = await fetch(`${baseUrl}/avioes/${created.id}`, {
      headers: { Authorization: `Bearer ${login.token}` }
    });
    assert.equal(response.status, 200);

    response = await fetch(`${baseUrl}/avioes/${created.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`
      },
      body: JSON.stringify({ modelo: 'Embraer E195', companhia: 'Azul', capacidade: 132 })
    });
    assert.equal(response.status, 200);
    const updated = await response.json();
    assert.equal(updated.modelo, 'Embraer E195');

    response = await fetch(`${baseUrl}/avioes/${created.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${login.token}` }
    });
    assert.equal(response.status, 200);

    response = await fetch(`${baseUrl}/avioes`, {
      headers: { Authorization: `Bearer ${login.token}` }
    });
    const after = await response.json();
    assert.equal(after.length, lengthBefore);

    assert.ok(usuarios[0].senha !== '123456');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
