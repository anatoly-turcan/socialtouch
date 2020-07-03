const { Router } = require('express');
const groupController = require('../controllers/groupController');

const router = Router();

router
  .route('/')
  .get(groupController.getAllGroups)
  .post(groupController.createGroup);

router
  .route('/:link')
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);

module.exports = router;
