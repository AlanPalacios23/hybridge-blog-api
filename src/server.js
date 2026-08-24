const app = require('./app');
const database = require('./config/database');
const { env, assertRequiredEnv } = require('./config/env');
const { runMigrations } = require('./database/migrate');

let server;
let shuttingDown = false;

async function start() {
  assertRequiredEnv();
  await runMigrations();

  server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`Hybridge Blog API ejecutándose en el puerto ${env.port}`);
    console.log(`Entorno: ${env.nodeEnv}`);
  });
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} recibido. Cerrando el servidor...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await database.close();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (error) => {
  console.error('Promesa rechazada sin manejar:', error);
  shutdown('unhandledRejection');
});

start().catch((error) => {
  console.error('No fue posible iniciar la API:', error.message);
  process.exit(1);
});
