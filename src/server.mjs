import express from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import config from './config.mjs';
import routes from './routes/index.mjs';

// Modèles et services
import AlbumSchema from './models/album.mjs';
import PhotoSchema from './models/photo.mjs';
import UserSchema from './models/user.mjs';
import AlbumService from './services/albumService.mjs';
import PhotoService from './services/photoService.mjs';
import UserService from './services/userService.mjs';
import AuthService from './services/authService.mjs';
import ProfileGeneratorService from './services/profileGeneratorService.mjs';
import AlbumController from './controllers/albumController.mjs';
import PhotoController from './controllers/photoController.mjs';
import UserController from './controllers/userController.mjs';
import AuthController from './controllers/authController.mjs';
import ProfileGeneratorController from './controllers/profileGeneratorController.mjs';

// Middlewares
import { apiLimiter } from './middlewares/rateLimit.mjs';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.mjs';

dotenv.config(); // charge .env

export default class Server {
  constructor(env = process.argv[2] || config.current) {
    // « env » vaut 'development' ou 'production'
    this.app = express();
    this.config = config[env];
    if (!this.config) throw new Error(`Environnement inconnu : ${env}`);
  }

  async dbConnect() {
    try {
      const uri = this.config.mongodb;
      console.log('[MongoDB] tentative de connexion →', uri);

      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      console.log('[MongoDB] connecté avec succès');
      this.connection = mongoose.connection;

      // Gestion propre de SIGINT
      process.on('SIGINT', async () => {
        await this.connection.close();
        console.log('[MongoDB] connexion fermée (SIGINT)');
        process.exit(0);
      });
    } catch (err) {
      console.error('[MongoDB] erreur de connexion :', err.message);
      throw err;
    }
  }

  /* Middlewares globaux */
  middleware() {
    // Sécurité
    this.app.use(helmet());
    this.app.disable('x-powered-by');

    // CORS
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Limiteur de requêtes global
    this.app.use(apiLimiter);
    // Compression et parsing
    this.app.use(compression());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  /* Instancie modèles, services, contrôleurs, routes */
  routes() {
    // Modèles
    const AlbumModel = mongoose.model('Album', AlbumSchema);
    const PhotoModel = mongoose.model('Photo', PhotoSchema);
    const UserModel = mongoose.model('User', UserSchema);

    // Services
    const albumService = new AlbumService(AlbumModel);
    const photoService = new PhotoService(PhotoModel, AlbumModel);
    const userService = new UserService(UserModel);
    const authService = new AuthService(UserModel);
    const profileGeneratorService = new ProfileGeneratorService();

    // Contrôleurs
    const albumController = new AlbumController(albumService);
    const photoController = new PhotoController(photoService);
    const userController = new UserController(userService);
    const authController = new AuthController(authService);
    const profileGeneratorController = new ProfileGeneratorController();

    // Routes
    console.log('[API] Initialisation des routes...');
    new routes.AlbumRoutes(this.app, albumController);
    new routes.PhotoRoutes(this.app, photoController);
    new routes.AuthRoutes(this.app, authController);
    new routes.UserRoutes(this.app, userController);
    new routes.ProfileGeneratorRoutes(this.app, profileGeneratorController);
    console.log('[API] Routes initialisées avec succès');

    // Middleware pour les routes non trouvées (404)
    this.app.use(notFoundHandler);

    // Middleware de gestion globale des erreurs
    this.app.use(errorHandler);
  }

  /* Lance le serveur HTTP */
  async run() {
    await this.dbConnect();
    this.middleware();
    this.routes();

    this.app.listen(this.config.port, () => {
      console.log(`[API] Écoute sur le port ${this.config.port} [${this.config.type}]`);
    });
  }
}
