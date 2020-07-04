const { Router } = require('express');
const groupController = require('../controllers/groupController');
const postRouter = require('./postRoutes');

const router = Router();

router.use('/:gLink/posts', groupController.groupProtect, postRouter);
router.use('/:gLink/posts/:link', groupController.groupProtect, postRouter);

router
  .route('/')
  .get(groupController.getAllGroups)
  .post(groupController.createGroup);

router
  .route('/:link')
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);

router.route('/:link/subscribe').post(groupController.subscribe);
router.route('/:link/unsubscribe').post(groupController.unsubscribe);

router.route('/:link/subscribers').get(groupController.getSubscribers);

module.exports = router;
