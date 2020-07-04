const { Router } = require('express');
const meRouter = require('./meRoutes');
const postRouter = require('./postRoutes');

const userController = require('../controllers/userController');

const router = Router();

router.use('/me', meRouter);
router.use('/:link/posts', postRouter);

router.route('/').get(userController.getAllUsers);
router.route('/:link').get(userController.getUser);

router.route('/:link/groups').get(userController.getGroups);

module.exports = router;
