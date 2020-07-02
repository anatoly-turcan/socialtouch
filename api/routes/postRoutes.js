const { Router } = require('express');
const postController = require('../controllers/postController');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route('/:link')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
