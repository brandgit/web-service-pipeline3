import ProfileGeneratorService from '../services/profileGeneratorService.mjs';

class ProfileGeneratorController {
  constructor() {
    this.profileGeneratorService = new ProfileGeneratorService();
  }

  /**
   * Génère un profil utilisateur complet en combinant plusieurs sources de données
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   * @param {Function} next - Fonction middleware suivante
   */
  async generateProfile(req, res, next) {
    try {
      const profile = await this.profileGeneratorService.generateCompleteProfile();
      res.status(200).json(profile);
    } catch (error) {
      console.error('Erreur lors de la génération du profil:', error);
      next(error);
    }
  }
}

export default ProfileGeneratorController; 