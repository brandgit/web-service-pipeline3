import { authValidators } from '../middlewares/validators.mjs';
import { authenticate } from '../middlewares/auth.mjs';
import { authLimiter } from '../middlewares/rateLimit.mjs';

export default class AuthRoutes {
  constructor(app, authController) {
    this.app = app;
    this.authController = authController;
    this.initRoutes();
  }

  initRoutes() {
    // Route d'inscription
    this.app.post(
      '/auth/register',
      authLimiter,
      authValidators.register,
      (req, res) => this.authController.register(req, res)
    );

    // Route de connexion
    this.app.post(
      '/auth/login',
      authLimiter,
      authValidators.login,
      (req, res) => this.authController.login(req, res)
    );

    // Route pour récupérer le profil de l'utilisateur connecté
    this.app.get(
      '/auth/profile',
      authenticate,
      (req, res) => this.authController.getProfile(req, res)
    );
  }
}
