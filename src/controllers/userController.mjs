import { validationResult } from 'express-validator';

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const { query } = req;
      const options = {
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await this.userService.getAllUsers(query, options);

      return res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      console.error(`[ERROR] GET /users -> ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message
      });
    }
  }

  // Récupérer un utilisateur par son ID
  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error(`[ERROR] GET /users/${req.params.id} -> ${error.message}`);

      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur',
        error: error.message
      });
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: updatedUser
      });
    } catch (error) {
      console.error(`[ERROR] PUT /users/${req.params.id} -> ${error.message}`);

      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error.message
      });
    }
  }

  // Changer le mot de passe d'un utilisateur
  async changePassword(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      await this.userService.changePassword(
        req.params.id,
        currentPassword,
        newPassword
      );

      return res.status(200).json({
        success: true,
        message: 'Mot de passe mis à jour avec succès'
      });
    } catch (error) {
      console.error(`[ERROR] PUT /users/${req.params.id}/password -> ${error.message}`);

      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Mot de passe actuel incorrect') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors du changement de mot de passe',
        error: error.message
      });
    }
  }

  // Désactiver un compte utilisateur
  async deactivateUser(req, res) {
    try {
      const updatedUser = await this.userService.deactivateUser(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Utilisateur désactivé avec succès',
        data: updatedUser
      });
    } catch (error) {
      console.error(`[ERROR] PUT /users/${req.params.id}/deactivate -> ${error.message}`);

      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la désactivation de l\'utilisateur',
        error: error.message
      });
    }
  }

  // Activer un compte utilisateur
  async activateUser(req, res) {
    try {
      const updatedUser = await this.userService.activateUser(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Utilisateur activé avec succès',
        data: updatedUser
      });
    } catch (error) {
      console.error(`[ERROR] PUT /users/${req.params.id}/activate -> ${error.message}`);

      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'activation de l\'utilisateur',
        error: error.message
      });
    }
  }

  // Supprimer un utilisateur
  async deleteUser(req, res) {
    try {
      await this.userService.deleteUser(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      console.error(`[ERROR] DELETE /users/${req.params.id} -> ${error.message}`);

      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        error: error.message
      });
    }
  }
}

export default UserController;
