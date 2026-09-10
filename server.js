const { app, state, startServer } = require('./src/app');

if (require.main === module) {
  startServer();
}

module.exports = { app, usuarios: state.usuarios };
