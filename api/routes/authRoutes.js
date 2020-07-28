const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);
router.route('/signout').post(authController.signout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
