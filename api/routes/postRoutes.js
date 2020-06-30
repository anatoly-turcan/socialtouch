const { Router } = require('express');
const postModel = require('../models/postModel');

const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const router = Router();

router.use((req, res, next) => {
  req.Post = postModel(req.db);
  // req.Post.sync();
  next();
});

router.route('/').get(getAllPosts).post(createPost);
router.route('/:link').get(getPost).patch(updatePost).delete(deletePost);

module.exports = router;
