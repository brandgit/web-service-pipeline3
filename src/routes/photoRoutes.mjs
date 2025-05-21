class PhotoRoutes {
  constructor(app, photoController) {
    this.app = app;
    this.photoController = photoController;
    this.initRoutes();
  }

  initRoutes() {
    this.app.get('/album/:idalbum/photos', (req, res) => this.photoController.getPhotosByAlbum(req, res));
    this.app.get('/album/:idalbum/photo/:idphotos', (req, res) => this.photoController.getPhotoById(req, res));
    this.app.post('/album/:idalbum/photo', (req, res) => this.photoController.createPhoto(req, res));
    this.app.put('/album/:idalbum/photo/:idphotos', (req, res) => this.photoController.updatePhoto(req, res));
    this.app.delete('/album/:idalbum/photo/:idphotos', (req, res) => this.photoController.deletePhoto(req, res));
  }
}

export default PhotoRoutes;
