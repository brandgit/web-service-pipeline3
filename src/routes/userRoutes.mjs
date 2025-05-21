import { userValidators } from '../middlewares/validators.mjs';
import { authenticate, authRoles } from '../middlewares/auth.mjs';
import { apiLimiter } from '../middlewares/rateLimit.mjs';

export default class UserRoutes {
  constructor(app, userController) {
    this.app = app;
    this.userController = userController;
    this.initRoutes();
  }

  initRoutes() {
    // Routes publiques (aucune)

    // Routes protégées (authentification requise)
    // Route pour récupérer tous les utilisateurs
    this.app.get(
      '/users',
      apiLimiter,
      authenticate,
      authRoles.adminOnly,
      userValidators.pagination,
      (req, res) => this.userController.getAllUsers(req, res)
    );

    // Route pour récupérer un utilisateur par son ID
    this.app.get(
      '/users/:id',
      apiLimiter,
      authenticate,
      userValidators.userId,
      authRoles.sameUser,
      (req, res) => this.userController.getUserById(req, res)
    );

    // Route pour mettre à jour un utilisateur
    this.app.put(
      '/users/:id',
      apiLimiter,
      authenticate,
      userValidators.userId,
      authRoles.sameUser,
      userValidators.createOrUpdate,
      (req, res) => this.userController.updateUser(req, res)
    );

    // Route pour changer le mot de passe
    this.app.put(
      '/users/:id/password',
      apiLimiter,
      authenticate,
      userValidators.userId,
      authRoles.sameUser,
      userValidators.changePassword,
      (req, res) => this.userController.changePassword(req, res)
    );

    // Routes réservées aux administrateurs
    // Route pour désactiver un compte utilisateur
    this.app.put(
      '/users/:id/deactivate',
      apiLimiter,
      authenticate,
      authRoles.adminOnly,
      userValidators.userId,
      (req, res) => this.userController.deactivateUser(req, res)
    );

    // Route pour activer un compte utilisateur
    this.app.put(
      '/users/:id/activate',
      apiLimiter,
      authenticate,
      authRoles.adminOnly,
      userValidators.userId,
      (req, res) => this.userController.activateUser(req, res)
    );

    // Route pour supprimer un utilisateur
    this.app.delete(
      '/users/:id',
      apiLimiter,
      authenticate,
      authRoles.adminOnly,
      userValidators.userId,
      (req, res) => this.userController.deleteUser(req, res)
    );
  }
}
