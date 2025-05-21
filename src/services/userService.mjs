class UserService {
  constructor(UserModel) {
    this.UserModel = UserModel;
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(query = {}, options = {}) {
    try {
      const filter = {};

      if (query.role) {
        filter.role = query.role;
      }

      if (query.isActive !== undefined) {
        filter.isActive = query.isActive === 'true';
      }

      if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        filter.$or = [
          { username: searchRegex },
          { email: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex }
        ];
      }

      // Options de pagination
      const page = parseInt(options.page, 10) || 1;
      const limit = parseInt(options.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const users = await this.UserModel.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await this.UserModel.countDocuments(filter);

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  }

  // Récupérer un utilisateur par son ID
  async getUserById(id) {
    try {
      const user = await this.UserModel.findById(id).select('-password');

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(id, updateData) {
    try {
      // Empêcher la mise à jour du mot de passe via cette méthode
      const sanitizedData = { ...updateData };
      if (sanitizedData.password) {
        delete sanitizedData.password;
      }

      const updatedUser = await this.UserModel.findByIdAndUpdate(
        id,
        sanitizedData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        throw new Error('Utilisateur non trouvé');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
    }
  }

  // Changer le mot de passe d'un utilisateur
  async changePassword(id, currentPassword, newPassword) {
    try {
      const user = await this.UserModel.findById(id);

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier le mot de passe actuel
      const isPasswordValid = await user.comparePassword(currentPassword);

      if (!isPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Mettre à jour le mot de passe
      user.password = newPassword;
      await user.save();

      return { success: true, message: 'Mot de passe mis à jour avec succès' };
    } catch (error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
  }

  // Désactiver un compte utilisateur
  async deactivateUser(id) {
    try {
      const updatedUser = await this.UserModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        throw new Error('Utilisateur non trouvé');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Erreur lors de la désactivation de l'utilisateur: ${error.message}`);
    }
  }

  // Activer un compte utilisateur
  async activateUser(id) {
    try {
      const updatedUser = await this.UserModel.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        throw new Error('Utilisateur non trouvé');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Erreur lors de l'activation de l'utilisateur: ${error.message}`);
    }
  }

  // Supprimer définitivement un utilisateur
  async deleteUser(id) {
    try {
      const deletedUser = await this.UserModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new Error('Utilisateur non trouvé');
      }

      return { success: true, message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    }
  }
}

export default UserService;
