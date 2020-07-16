const { Router } = require('express');
const groupController = require('../controllers/groupController');
const postController = require('../controllers/postController');

const router = Router();

router
  .route('/:gLink/posts')
  .get(groupController.groupProtect, postController.getAllPosts)
  .post(groupController.groupProtect, postController.createPost);
router
  .route('/:gLink/posts/:link')
  .patch(groupController.groupProtect, postController.updateGroupPost)
  .delete(groupController.groupProtect, postController.deleteGroupPost);

router
  .route('/')
  .get(groupController.getAllGroups)
  .post(groupController.createGroup);

router.route('/search').get(groupController.searchGroups);

router
  .route('/:link')
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);

router.route('/:link/subscribe').post(groupController.subscribe);
router.route('/:link/unsubscribe').post(groupController.unsubscribe);

router.route('/:link/subscribers').get(groupController.getSubscribers);

module.exports = router;
