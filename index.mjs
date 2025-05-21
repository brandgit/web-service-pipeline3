import API from './src/main.mjs';

const api = new API();

api.start().catch((err) => {
  console.error('Erreur lors du démarrage du serveur:', err);
  process.exit(1);
});
