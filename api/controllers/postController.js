// const apiFilter = require('../utils/apiFilter');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const validate = require('../utils/validate');
const apiFilter = require('../utils/apiFilter');
const postConstraints = require('../validators/postConstraints');
const Post = require('../entities/postSchema');
const PostModel = require('../models/postModel');

exports.getAllPosts = catchError(async ({ connection, query }, res, next) => {
  const filter = apiFilter(query, 'post');

  const posts = await connection
    .getRepository(Post)
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .select([...filter.fields, 'user.username', 'user.link', 'user.img_id'])
    .skip(filter.offset)
    .take(filter.limit)
    .orderBy(...filter.order)
    .getMany();

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchError(async ({ connection, params }, res, next) => {
  const post = await connection
    .getRepository(Post)
    .createQueryBuilder('post')
    .where('post.link = :link', { link: params.link })
    .leftJoinAndSelect('post.user', 'user')
    .select(['post', 'user.username', 'user.link', 'user.img_id'])
    .getOne();

  console.log(post);

  if (!post) return next(new AppError('Document not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.createPost = catchError(
  async ({ connection, body, user }, res, next) => {
    const { content } = body;

    const validation = validate({ content }, postConstraints);
    if (validation) return next(new AppError(validation, 400));

    const post = new PostModel(user.id, content);
    const newPost = await connection.getRepository(Post).save(post.prepare());

    res.status(201).json({
      status: 'success',
      data: {
        post: newPost,
      },
    });
  }
);

exports.updatePost = catchError(
  async ({ connection, params, body, user }, res, next) => {
    const { content } = body;

    const validation = validate({ content }, postConstraints);
    if (validation) return next(new AppError(validation, 400));

    const { affected } = await connection
      .getRepository(Post)
      .createQueryBuilder('post')
      .update()
      .set({ content, user_id: user.id })
      .where('post.link = :link', { link: params.link })
      .execute();

    if (!affected) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.deletePost = catchError(
  async ({ connection, params, user }, res, next) => {
    const post = await connection
      .getRepository(Post)
      .createQueryBuilder('post')
      .select()
      .where('post.link = :link', { link: params.link })
      .getOne();

    if (!post) return next(new AppError('Document not found', 404));

    if (post.user_id !== user.id)
      return next(
        new AppError('You do not have permission to delete this post')
      );

    await connection
      .getRepository(Post)
      .createQueryBuilder('post')
      .delete()
      .where('post.id = :id', { id: post.id })
      .execute();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
