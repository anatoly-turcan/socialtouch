const apiFilter = require('../utils/apiFilter');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');

exports.getAllPosts = catchError(async ({ Post, query }, res, next) => {
  const posts = await Post.findAll(apiFilter(query, 'post_id'));

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchError(async ({ Post, params }, res, next) => {
  const post = await Post.findOne({ where: { link: params.link } });

  if (!post) return next(new AppError('Document not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.createPost = catchError(async ({ Post, body }, res, next) => {
  const newPost = await Post.create({
    content: body.content,
    link: Post.generateLink(),
  });

  res.status(200).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

exports.updatePost = catchError(async ({ Post, params, body }, res, next) => {
  const result = await Post.update(
    { content: body.content },
    {
      where: {
        link: params.link,
      },
    }
  );

  if (!result[0]) return next(new AppError('Document not found', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deletePost = catchError(async ({ Post, params }, res, next) => {
  const result = await Post.destroy({
    where: {
      link: params.link,
    },
  });

  if (!result) return next(new AppError('Document not found', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
