const { Router } = require('express');
const postModel = require('../models/postModel');

const postController = require('../controllers/postController');

const router = Router();

router.use((req, res, next) => {
  req.Post = postModel(req.db);

  if (process.env.DB_ALLOW_SYNC) req.Post.sync({ alter: true });

  next();
});

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
