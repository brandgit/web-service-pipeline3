class AlbumController {
  constructor(albumService) {
    this.albumService = albumService;
  }

  async getAllAlbums(req, res) {
    try {
      const albums = await this.albumService.getAllAlbums(req.query);
      res.status(200).json(albums);
    } catch (error) {
      console.error(`[ERROR] GET /albums -> ${error.message}`);
      res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async getAlbumById(req, res) {
    try {
      const album = await this.albumService.getAlbumById(req.params.id);
      if (!album) {
        return res.status(404).json({
          code: 404,
          message: 'Album non trouvé'
        });
      }

      return res.status(200).json(album);
    } catch (error) {
      console.error(`[ERROR] GET /album/${req.params.id} -> ${error.message}`);
      return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async createAlbum(req, res) {
    try {
      const album = await this.albumService.createAlbum(req.body);
      res.status(201).json(album);
    } catch (error) {
      console.error(`[ERROR] POST /album -> ${error.message}`);
      res.status(400).json({
        code: 400,
        message: 'Bad Request'
      });
    }
  }

  async updateAlbum(req, res) {
    try {
      const updatedAlbum = await this.albumService.updateAlbum(req.params.id, req.body);
      return res.status(200).json(updatedAlbum);
    } catch (error) {
      console.error(`[ERROR] PUT /album/${req.params.id} -> ${error.message}`);

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

  async deleteAlbum(req, res) {
    try {
      const album = await this.albumService.deleteAlbum(req.params.id);
      return res.status(200).json(album);
    } catch (error) {
      console.error(`[ERROR] DELETE /album/${req.params.id} -> ${error.message}`);

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
}

export default AlbumController;
