const { Router } = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');

const upload = multer();

const router = Router();

router
  .route('/')
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router
  .route('/settings')
  .get(userController.getMySettings)
  .patch(userController.updateMySettings);

router
  .route('/updateImage')
  .post(upload.single('photo'), userController.updateImage);

module.exports = router;
