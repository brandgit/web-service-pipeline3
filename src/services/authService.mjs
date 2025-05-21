import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_jwt_par_défaut'; // à remplacer en production
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

class AuthService {
  constructor(UserModel) {
    this.UserModel = UserModel;
  }

  // Générer un token JWT
  generateToken(userId, username, role) {
    return jwt.sign(
      { id: userId, username, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Vérifier et décoder un token JWT
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  // Authentifier un utilisateur
  async login(username, password) {
    // Chercher l'utilisateur par nom d'utilisateur
    const user = await this.UserModel.findOne({ username });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (!user.isActive) {
      throw new Error('Ce compte a été désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Mot de passe incorrect');
    }

    // Mettre à jour la date de dernière connexion
    await this.UserModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Générer un token JWT
    const token = this.generateToken(user._id, user.username, user.role);

    return {
      user: user.toJSON(),
      token
    };
  }

  // Enregistrer un nouvel utilisateur
  async register(userData) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.UserModel.findOne({
      $or: [
        { username: userData.username },
        { email: userData.email }
      ]
    });

    if (existingUser) {
      throw new Error('Nom d\'utilisateur ou email déjà utilisé');
    }

    // Créer un nouvel utilisateur
    const user = new this.UserModel(userData);
    await user.save();

    // Générer un token JWT
    const token = this.generateToken(user._id, user.username, user.role);

    return {
      user: user.toJSON(),
      token
    };
  }
}

export default AuthService;
