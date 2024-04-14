const express = require('express');
const multer = require('multer');
const router = express.Router();

const userController = require('../cotrollers/userController');
const imageController = require('../cotrollers/imageController');
const verifyToken = require('../middleware/verifyToken');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ 
    storage: storage,
  });

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/upload',upload.single('image'),verifyToken,imageController.uploadImage);
router.get('/image/:id',verifyToken,imageController.getImage);
router.get('/images',verifyToken, imageController.getAllImages);
router.delete('/image/:id',verifyToken, imageController.deleteImage);


module.exports = router;