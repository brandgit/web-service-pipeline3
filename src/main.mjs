import Server from './server.mjs';

class API {
  async start() {
    console.log('Démarrage du serveur API...');

    try {
      const server = new Server();
      await server.run();
      console.log('Serveur API démarré avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors du démarrage du serveur:', error);
      throw error;
    }
  }
}

export default API;
