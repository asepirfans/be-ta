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

router.post('/upload',upload.single('image'),verifyToken,imageController.uploadDetect);
router.get('/detect/:id',verifyToken,imageController.getDetect);
router.get('/detects',verifyToken, imageController.getAllDetects);
router.delete('/detect/:id',verifyToken, imageController.deleteDetect);


module.exports = router;