const { Router } = require('express');
const userController = require('../controllers/userController');

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

module.exports = router;
