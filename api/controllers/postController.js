// const apiFilter = require('../utils/apiFilter');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const validate = require('../utils/validate');
const apiFilter = require('../utils/apiFilter');
const postConstraints = require('../validators/postConstraints');
const Post = require('../entities/postSchema');
const User = require('../entities/userSchema');
const PostModel = require('../models/postModel');

exports.getAllPosts = catchError(
  async ({ connection, query, params }, res, next) => {
    const filter = apiFilter(query, 'post');
    const repo = connection.getRepository(Post);
    let posts;

    if (params.link) {
      posts = await repo
        .createQueryBuilder('post')
        .select(filter.fields)
        .where((qb) => {
          const subQuery = qb
            .subQuery()
            .select('user.id')
            .from(User, 'user')
            .where('user.link = :link')
            .getQuery();

          return `post.user_id = ${subQuery}`;
        })
        .setParameter('link', params.link)
        .skip(filter.offset)
        .take(filter.limit)
        .orderBy(...filter.order)
        .getMany();
    } else {
      posts = await repo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .select([...filter.fields, 'user.username', 'user.link', 'user.img_id'])
        .skip(filter.offset)
        .take(filter.limit)
        .orderBy(...filter.order)
        .getMany();
    }

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  }
);

exports.getPost = catchError(async ({ connection, params }, res, next) => {
  const post = await connection
    .getRepository(Post)
    .createQueryBuilder('post')
    .where('post.link = :link', { link: params.link })
    .leftJoinAndSelect('post.user', 'user')
    .select(['post', 'user.username', 'user.link', 'user.img_id'])
    .getOne();

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
      .createQueryBuilder()
      .update()
      .set({ content, user_id: user.id })
      .where('link = :link', { link: params.link })
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
    const repo = connection.getRepository(Post);

    const post = await repo
      .createQueryBuilder()
      .select()
      .where('link = :link', { link: params.link })
      .getOne();

    if (!post) return next(new AppError('Document not found', 404));

    if (post.user_id !== user.id)
      return next(
        new AppError('You do not have permission to delete this post')
      );

    await repo
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: post.id })
      .execute();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
