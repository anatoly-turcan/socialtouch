const { Router } = require('express');
const meRouter = require('./meRoutes');
const postRouter = require('./postRoutes');

const userController = require('../controllers/userController');

const router = Router();

router.use('/me', meRouter);
router.use('/:link/posts', postRouter);

router.route('/').get(userController.getAllUsers);
router.route('/search').get(userController.searchUsers);
router.route('/:link').get(userController.getUser);
router.route('/:link/groups').get(userController.getGroups);
router.route('/:link/groupsCount').get(userController.getGroupsCount);
// router.route('/:link/images').get(userController.getImages);
router.route('/:link/settings').get(userController.getUserSettings);
router.route('/:link/friendsCount').get(userController.getFriendsCount);

router
  .route('/:link/friends')
  .post(userController.addFriend)
  .delete(userController.unfriend)
  .get(userController.getFriends);

router.route('/:link/confirmFriendship').post(userController.confirmFriendship);

module.exports = router;
