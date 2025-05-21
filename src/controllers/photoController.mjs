class PhotoController {
  constructor(photoService) {
    this.photoService = photoService;
  }

  async getPhotosByAlbum(req, res) {
    try {
      const photos = await this.photoService.getPhotosByAlbum(req.params.idalbum);
      return res.status(200).json(photos);
    } catch (error) {
      console.error(`[ERROR] GET /album/${req.params.idalbum}/photos -> ${error.message}`);
      return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async getPhotoById(req, res) {
    try {
      const photo = await this.photoService.getPhotoById(req.params.idphotos);
      return res.status(200).json(photo);
    } catch (error) {
      console.error(`[ERROR] GET /album/${req.params.idalbum}/photo/${req.params.idphotos} -> ${error.message}`);

      if (error.message === 'Photo non trouvée') {
        return res.status(404).json({
          code: 404,
          message: error.message
        });
      }

      return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async createPhoto(req, res) {
    try {
      const savedPhoto = await this.photoService.createPhoto(req.params.idalbum, req.body);
      return res.status(201).json(savedPhoto);
    } catch (error) {
      console.error(`[ERROR] POST /album/${req.params.idalbum}/photo -> ${error.message}`);

      if (error.message === 'Album non trouvé') {
        return res.status(404).json({
          code: 404,
          message: error.message
        });
      }

      return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async updatePhoto(req, res) {
    try {
      const updatedPhoto = await this.photoService.updatePhoto(
        req.params.idalbum,
        req.params.idphotos,
        req.body
      );
      return res.status(200).json(updatedPhoto);
    } catch (error) {
      console.error(`[ERROR] PUT /album/${req.params.idalbum}/photo/${req.params.idphotos} -> ${error.message}`);

      if (error.message === 'Photo non trouvée ou album incorrect') {
        return res.status(404).json({
          code: 404,
          message: error.message
        });
      }

      return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async deletePhoto(req, res) {
    try {
      await this.photoService.deletePhoto(req.params.idalbum, req.params.idphotos);
      return res.status(200).json({
        message: 'Photo supprimée avec succès'
      });
    } catch (error) {
      console.error(`[ERROR] DELETE /album/${req.params.idalbum}/photo/${req.params.idphotos} -> ${error.message}`);

      if (error.message === 'Photo non trouvée') {
        return res.status(404).json({
          code: 404,
          message: error.message
        });
      }

      return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }
}

export default PhotoController;
