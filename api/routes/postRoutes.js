const { Router } = require('express');
const postController = require('../controllers/postController');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router.route('/news').get(postController.getNews);

router
  .route('/:link')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

router
  .route('/:link/comments')
  .get(postController.insertPost, postController.getAllComments)
  .post(postController.insertPost, postController.createComment);

router
  .route('/:link/comments/:cLink')
  .patch(
    postController.insertPost,
    postController.insertComment,
    postController.updateComment
  )
  .delete(
    postController.insertPost,
    postController.insertComment,
    postController.deleteComment
  );

module.exports = router;
