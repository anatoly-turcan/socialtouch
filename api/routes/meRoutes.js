const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router
  .route('/')
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router.route('/settings').patch(userController.updateMySettings);
router.route('/friendRequests').get(userController.getFriendRequests);
router.route('/updateImage').patch(userController.updateImage);

module.exports = router;
