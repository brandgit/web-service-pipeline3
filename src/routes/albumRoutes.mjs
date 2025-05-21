class AlbumRoutes {
  constructor(app, albumController) {
    this.app = app;
    this.albumController = albumController;
    this.initRoutes();
  }

  initRoutes() {
    this.app.get('/albums', (req, res) => this.albumController.getAllAlbums(req, res));

    this.app.get('/album/:id', (req, res) => this.albumController.getAlbumById(req, res));

    this.app.post('/album', (req, res) => this.albumController.createAlbum(req, res));

    this.app.put('/album/:id', (req, res) => this.albumController.updateAlbum(req, res));

    this.app.delete('/album/:id', (req, res) => this.albumController.deleteAlbum(req, res));
  }
}

export default AlbumRoutes;
