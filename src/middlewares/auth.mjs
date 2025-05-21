import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ROLES } from '../models/user.mjs';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_jwt_par_défaut';

/**
 * Middleware d'authentification vérifiant le JWT
 */
export const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token d'authentification
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant ou format invalide.'
      });
    }

    // Extraire le token du header
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };

    // Passer au middleware suivant
    return next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide. Veuillez vous reconnecter.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

/**
 * Middleware d'autorisation basé sur les rôles
 * @param {string[]} roles - Tableau des rôles autorisés
 */
export const authorize = (allowedRoles = []) => (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    // Si aucun rôle n'est spécifié, tous les utilisateurs authentifiés sont autorisés
    if (allowedRoles.length === 0) {
      return next();
    }

    // Vérifier si l'utilisateur a un rôle autorisé
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Vous n\'avez pas les permissions nécessaires.'
      });
    }

    // L'utilisateur a un rôle autorisé
    return next();
  } catch (error) {
    console.error('[AUTHORIZATION MIDDLEWARE] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'autorisation'
    });
  }
};

/**
 * Middlewares d'autorisation préconfigurés pour des cas d'usage courants
 */
export const authRoles = {
  // Middleware pour n'autoriser que les administrateurs
  adminOnly: authorize([ROLES.ADMIN]),

  // Middleware pour autoriser les admins et les éditeurs
  adminOrEditor: authorize([ROLES.ADMIN, ROLES.EDITOR]),

  // Middleware pour vérifier que l'utilisateur accède à ses propres ressources
  sameUser: (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      // Vérifier si l'ID de l'utilisateur correspond à l'ID demandé
      // Ou si l'utilisateur est un administrateur (qui peut accéder à toutes les ressources)
      if (req.user.id === req.params.id || req.user.role === ROLES.ADMIN) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Vous ne pouvez accéder qu\'à vos propres ressources.'
      });
    } catch (error) {
      console.error('[SAME USER MIDDLEWARE] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur d\'autorisation'
      });
    }
  }
};

export default {
  authenticate,
  authorize,
  authRoles
};
