/**
 * Gestionnaire d'erreurs pour les erreurs 404 (ressource non trouvée)
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Classe personnalisée pour les erreurs API
 */
export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Gestionnaire global d'erreurs
 */
export const errorHandler = (err, req, res) => {
  // En cas d'erreur du framework (express, etc.)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur';
  let error = { ...err, statusCode, message };

  // Journaliser l'erreur
  console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Erreurs MongoDB spécifiques
  if (err.name === 'CastError') {
    const customMessage = `Ressource invalide: ${err.path}`;
    error = new ApiError(400, customMessage);
  }

  if (err.name === 'ValidationError') {
    const customMessage = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ApiError(400, customMessage);
  }

  // Erreur de duplication (code MongoDB 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const customMessage = `La valeur '${err.keyValue[field]}' pour le champ '${field}' existe déjà`;
    error = new ApiError(409, customMessage);
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Token invalide');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expiré');
  }

  // Réponse d'erreur formatée
  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default {
  notFoundHandler,
  ApiError,
  errorHandler
};
