const { Router } = require('express');
const userModel = require('../models/userModel');
const authController = require('../controllers/authController');

const router = Router();

router.use((req, res, next) => {
  req.User = userModel(req.db);

  if (process.env.DB_ALLOW_SYNC) req.User.sync({ alter: true });

  next();
});

router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updatePassword', authController.updatePassword);

module.exports = router;
