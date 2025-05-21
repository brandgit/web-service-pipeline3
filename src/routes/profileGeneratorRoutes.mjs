import { apiLimiter } from '../middlewares/rateLimit.mjs';

class ProfileGeneratorRoutes {
  constructor(app, controller) {
    this.app = app;
    this.controller = controller;
    this.initRoutes();
  }

  initRoutes() {
    // Route pour générer un profil complet
    this.app.get(
      '/api/profile/generate',
      apiLimiter,
      this.controller.generateProfile.bind(this.controller)
    );
  }
}

export default ProfileGeneratorRoutes; 