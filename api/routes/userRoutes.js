const { Router } = require('express');
const userModel = require('../models/userModel');
const userController = require('../controllers/userController');

const router = Router();

router.use((req, res, next) => {
  req.User = userModel(req.db);

  if (process.env.DB_ALLOW_SYNC) req.User.sync({ alter: true });

  next();
});

router.route('/').get(userController.getAllUsers);
router.route('/:link').get(userController.getUser);

module.exports = router;
