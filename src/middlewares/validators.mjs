import { body, param, query } from 'express-validator';
import { ROLES } from '../models/user.mjs';

/**
 * Validateurs pour l'authentification
 */
export const authValidators = {
  // Règles de validation pour l'enregistrement d'un utilisateur
  register: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscore'),

    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères')
      .matches(/[a-z]/)
      .withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
      .matches(/[A-Z]/)
      .withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
      .matches(/[0-9]/)
      .withMessage('Le mot de passe doit contenir au moins un chiffre'),

    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),

    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

    body('role')
      .optional()
      .isIn(Object.values(ROLES))
      .withMessage('Rôle invalide')
  ],

  // Règles de validation pour la connexion
  login: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Le nom d\'utilisateur est requis'),

    body('password')
      .notEmpty()
      .withMessage('Le mot de passe est requis')
  ]
};

/**
 * Validateurs pour la gestion des utilisateurs
 */
export const userValidators = {
  // Règles de validation pour la création/mise à jour d'un utilisateur
  createOrUpdate: [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscore'),

    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),

    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),

    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

    body('role')
      .optional()
      .isIn(Object.values(ROLES))
      .withMessage('Rôle invalide'),

    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('La valeur isActive doit être un booléen')
  ],

  // Règles de validation pour le changement de mot de passe
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Le mot de passe actuel est requis'),

    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
      .matches(/[a-z]/)
      .withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
      .matches(/[A-Z]/)
      .withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
      .matches(/[0-9]/)
      .withMessage('Le mot de passe doit contenir au moins un chiffre')
  ],

  // Validation de l'ID utilisateur
  userId: [
    param('id').isMongoId().withMessage('ID utilisateur invalide')
  ],

  // Validation des paramètres de pagination
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Le numéro de page doit être un entier positif'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('La limite doit être un entier entre 1 et 100')
  ]
};

export default {
  authValidators,
  userValidators
};
