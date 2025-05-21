import rateLimit from 'express-rate-limit';

/**
 * Configuration de base pour les limiteurs de taux
 */
const defaultOptions = {
  standardWindow: 15 * 60 * 1000, // 15 minutes
  standardMax: 100, // 100 requêtes par fenêtre

  // Message d'erreur personnalisé
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.'
  })
};

/**
 * Limiteur de taux pour les requêtes API générales
 */
export const apiLimiter = rateLimit({
  windowMs: defaultOptions.standardWindow,
  max: defaultOptions.standardMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultOptions.handler
});

/**
 * Limiteur de taux plus strict pour les opérations sensibles
 * (connexion, inscription, demande de réinitialisation mot de passe)
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 tentatives par heure
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Trop de tentatives d\'authentification. Veuillez réessayer dans une heure.'
  })
});

/**
 * Limiteur pour les requêtes par adresse IP
 * Cette fonction permet de créer un limiteur personnalisé
 */
export const createIpLimiter = (options = {}) => {
  const config = {
    windowMs: options.windowMs || defaultOptions.standardWindow,
    max: options.max || defaultOptions.standardMax,
    message: options.message || 'Trop de requêtes depuis cette adresse IP',
    standardHeaders: true,
    legacyHeaders: false
  };

  return rateLimit({
    ...config,
    handler: (req, res) => res.status(429).json({
      success: false,
      message: config.message
    })
  });
};

export default {
  apiLimiter,
  authLimiter,
  createIpLimiter
};
