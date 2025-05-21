import { validationResult } from 'express-validator';

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // Méthode pour l'inscription d'un utilisateur
  async register(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const userData = req.body;
      const result = await this.authService.register(userData);

      return res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: result
      });
    } catch (error) {
      console.error(`[ERROR] POST /auth/register -> ${error.message}`);

      if (error.message.includes('déjà utilisé')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      });
    }
  }

  // Méthode pour la connexion d'un utilisateur
  async login(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { username, password } = req.body;
      const result = await this.authService.login(username, password);

      return res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });
    } catch (error) {
      console.error(`[ERROR] POST /auth/login -> ${error.message}`);

      // Erreurs spécifiques à l'authentification
      if (error.message === 'Utilisateur non trouvé'
          || error.message === 'Mot de passe incorrect'
          || error.message === 'Ce compte a été désactivé') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion',
        error: error.message
      });
    }
  }

  // Méthode pour récupérer les données de l'utilisateur connecté
  async getProfile(req, res) {
    try {
      // Utilisateur est ajouté à la requête par le middleware d'authentification
      return res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.error(`[ERROR] GET /auth/profile -> ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error.message
      });
    }
  }
}

export default AuthController;
