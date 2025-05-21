import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user'
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir une adresse email valide']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'users',
  versionKey: false
});

// Ajout d'index pour améliorer les performances des requêtes
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Méthode pour hasher le mot de passe avant la sauvegarde
UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Méthode pour la mise à jour automatique de updatedAt
UserSchema.pre('findOneAndUpdate', function updateTimestamp() {
  this.set({ updatedAt: new Date() });
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Supprimer les champs sensibles lors de la sérialisation en JSON
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    const userObj = {
      id: ret._id,
      username: ret.username,
      email: ret.email,
      firstName: ret.firstName,
      lastName: ret.lastName,
      role: ret.role,
      isActive: ret.isActive,
      lastLogin: ret.lastLogin,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };

    return userObj;
  }
});

export { ROLES };
export default UserSchema;
