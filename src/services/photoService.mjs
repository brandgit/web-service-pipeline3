class PhotoService {
  constructor(PhotoModel, AlbumModel) {
    this.PhotoModel = PhotoModel;
    this.AlbumModel = AlbumModel;
  }

  async getPhotosByAlbum(albumId) {
    try {
      return await this.PhotoModel.find({ album: albumId });
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des photos: ${error.message}`);
    }
  }

  async getPhotoById(photoId) {
    try {
      const photo = await this.PhotoModel.findById(photoId);
      if (!photo) {
        throw new Error('Photo non trouvée');
      }
      return photo;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la photo: ${error.message}`);
    }
  }

  async createPhoto(albumId, photoData) {
    try {
      // Vérifier si l'album existe
      const albumExists = await this.AlbumModel.findById(albumId);
      if (!albumExists) {
        throw new Error('Album non trouvé');
      }

      const photo = new this.PhotoModel({ ...photoData, album: albumId });
      const savedPhoto = await photo.save();

      await this.AlbumModel.findByIdAndUpdate(
        albumId,
        { $push: { photos: savedPhoto._id } },
        { new: true }
      );

      return savedPhoto;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la photo: ${error.message}`);
    }
  }

  async updatePhoto(albumId, photoId, updateData) {
    try {
      const existingPhoto = await this.PhotoModel.findOne({
        _id: photoId,
        album: albumId
      });

      if (!existingPhoto) {
        throw new Error('Photo non trouvée ou album incorrect');
      }

      return await this.PhotoModel.findByIdAndUpdate(
        photoId,
        updateData,
        { new: true }
      );
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la photo: ${error.message}`);
    }
  }

  async deletePhoto(albumId, photoId) {
    try {
      const deletedPhoto = await this.PhotoModel.findByIdAndDelete(photoId);
      if (!deletedPhoto) {
        throw new Error('Photo non trouvée');
      }

      await this.AlbumModel.findByIdAndUpdate(
        albumId,
        { $pull: { photos: photoId } },
        { new: true }
      );

      return deletedPhoto;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la photo: ${error.message}`);
    }
  }
}

export default PhotoService;
