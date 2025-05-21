class AlbumService {
  constructor(AlbumModel) {
    this.AlbumModel = AlbumModel;
  }

  async getAllAlbums(query = {}) {
    try {
      let filter = {};
      if (query.name) {
        filter = { name: new RegExp(query.name, 'i') };
      }
      return await this.AlbumModel.find(filter).populate('photos');
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des albums: ${error.message}`);
    }
  }

  async getAlbumById(id) {
    try {
      return await this.AlbumModel.findById(id).populate('photos');
    } catch (error) {
      throw new Error(`Album non trouvé: ${error.message}`);
    }
  }

  async createAlbum(albumData) {
    try {
      const album = new this.AlbumModel(albumData);
      return await album.save();
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'album: ${error.message}`);
    }
  }

  async updateAlbum(id, updateData) {
    try {
      const updatedAlbum = await this.AlbumModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      if (!updatedAlbum) {
        throw new Error('Album non trouvé');
      }
      return updatedAlbum;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'album: ${error.message}`);
    }
  }

  async deleteAlbum(id) {
    try {
      const album = await this.AlbumModel.findByIdAndDelete(id);
      if (!album) {
        throw new Error('Album non trouvé');
      }
      return album;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'album: ${error.message}`);
    }
  }
}

export default AlbumService;
