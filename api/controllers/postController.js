// const apiFilter = require('../utils/apiFilter');
const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const postConstraints = require('../validators/postConstraints');
const commentConstraints = require('../validators/commentConstraints');
const Post = require('../entities/postSchema');
const User = require('../entities/userSchema');
const Comment = require('../entities/commentSchema');
const PostModel = require('../models/postModel');
const CommentModel = require('../models/commentModel');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

const alias = 'post';

exports.getAllPosts = catchError(
  async ({ connection, query, params, group }, res, next) => {
    const filter = apiFilter(query, alias);
    const builder = connection.getRepository(Post).createQueryBuilder(alias);

    if (params.link)
      builder
        .select(filter.fields)
        .where((qb) => {
          const subQuery = qb
            .subQuery()
            .select('user.id')
            .from(User, 'user')
            .where('user.link = :link')
            .getQuery();

          return `${alias}.userId = ${subQuery}`;
        })
        .setParameter('link', params.link);
    else if (group)
      builder.select(filter.fields).where(`${alias}.groupId = ${group.id}`);

    const posts = await builder
      .leftJoinAndSelect(`${alias}.user`, 'user')
      .leftJoinAndSelect(`${alias}.images`, 'images')
      .leftJoinAndSelect('user.image', 'img')
      .select([
        ...filter.fields,
        'images.location',
        'user.username',
        'user.link',
        'user.imgId',
        'img.location',
      ])
      .offset(filter.offset)
      .limit(filter.limit)
      .orderBy(...filter.order)
      .getMany();

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  }
);

exports.getPost = handlerFactory.getOne({
  Entity: Post,
  alias,
  where: `${alias}.link = :link`,
  whereSelectors: [['link', 'params', 'link']],
  join: [
    [`${alias}.user`, 'user'],
    [`${alias}.images`, 'images'],
    ['user.image', 'img'],
  ],
  joinSelectors: [
    alias,
    'images.location',
    'user.username',
    'user.link',
    'user.imgId',
    'img.location',
  ],
});

exports.createPost = handlerFactory.createOne({
  Entity: Post,
  Model: PostModel,
  bodyFields: ['content'],
  userId: 'userId',
  constraints: postConstraints,
  responseName: 'post',
});

exports.updatePost = handlerFactory.updateOne({
  Entity: Post,
  bodyFields: ['content'],
  constraints: postConstraints,
  where: 'link = :link AND userId = :id',
  whereSelectors: [
    ['link', 'params', 'link'],
    ['id', 'user', 'id'],
  ],
});

exports.deletePost = handlerFactory.deleteOne({
  Entity: Post,
  where: 'link = :link AND user = :id',
  whereSelectors: [
    ['link', 'params', 'link'],
    ['id', 'user', 'id'],
  ],
});

exports.insertPost = catchError(async (req, res, next) => {
  if (req.params.link) {
    const post = await req.connection
      .getRepository(Post)
      .findOne({ where: { link: req.params.link } });

    if (post) req.post = post;
    else return next(new AppError('Post not found', 404));
  }

  next();
});

exports.insertComment = catchError(async (req, res, next) => {
  if (req.params.cLink) {
    const comment = await req.connection
      .getRepository(Comment)
      .findOne({ where: { link: req.params.cLink } });

    if (comment) req.comment = comment;
    else return next(new AppError('Comment not found', 404));
  }

  next();
});

exports.createComment = handlerFactory.createOne({
  Entity: Comment,
  Model: CommentModel,
  bodyFields: ['content'],
  userId: 'userId',
  constraints: commentConstraints,
  responseName: 'comment',
});

exports.updateComment = handlerFactory.updateOne({
  Entity: Comment,
  bodyFields: ['content'],
  constraints: commentConstraints,
  where: 'id = :id AND postId = :postId AND userId = :userId',
  whereSelectors: [
    ['id', 'comment', 'id'],
    ['postId', 'post', 'id'],
    ['userId', 'user', 'id'],
  ],
});

exports.deleteComment = handlerFactory.deleteOne({
  Entity: Comment,
  where: 'id = :id AND postId = :postId AND userId = :userId',
  whereSelectors: [
    ['id', 'comment', 'id'],
    ['postId', 'post', 'id'],
    ['userId', 'user', 'id'],
  ],
});

exports.getAllComments = catchError(
  async ({ connection, post, query }, res, next) => {
    const { offset, limit } = apiFilter(query);

    const comments = await connection
      .getRepository(Comment)
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('user.image', 'image')
      .where('comments.postId = :id', { id: post.id })
      .select([
        'comments.content',
        'comments.link',
        'comments.createdAt',
        'user.username',
        'user.link',
        'user.imgId',
        'image.location',
      ])
      .limit(limit)
      .offset(offset)
      .getMany();

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: {
        comments,
      },
    });
  }
);
