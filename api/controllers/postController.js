const apiFilter = require('../utils/apiFilter');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');

exports.getAllPosts = catchError(async ({ Post, query }, res, next) => {
  const posts = await Post.findAll(apiFilter(query, Post));

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchError(async ({ Post, params }, res, next) => {
  const post = await Post.findOne({
    where: { link: params.link },
    ...apiFilter(null, Post),
  });

  if (!post) return next(new AppError('Document not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.createPost = catchError(async ({ Post, body, user }, res, next) => {
  const newPost = await Post.create({
    user_id: user.user_id,
    content: body.content,
    link: Post.generateLink(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      post: {
        link: newPost.link,
        content: newPost.content,
        previewLimit: newPost.content_preview_limit,
        createdAt: newPost.created_at,
      },
    },
  });
});

exports.updatePost = catchError(
  async ({ Post, params, body, user }, res, next) => {
    const result = await Post.update(
      {
        content: body.content,
        user_id: user.user_id,
      },
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
  }
);

exports.deletePost = catchError(async ({ Post, params, user }, res, next) => {
  const post = await Post.findOne({ where: { link: params.link } });

  if (!post) return next(new AppError('Document not found', 404));

  if (post.user_id !== user.user_id)
    return next(new AppError('You do not have permission to delete this post'));

  await Post.destroy({
    where: {
      link: params.link,
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
