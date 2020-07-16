// const apiFilter = require('../utils/apiFilter');
const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const AppError = require('../utils/appError');
const validate = require('../utils/validate');
const cloud = require('../utils/cloud');
const postConstraints = require('../validators/postConstraints');
const commentConstraints = require('../validators/commentConstraints');
const Post = require('../entities/postSchema');
const User = require('../entities/userSchema');
const Comment = require('../entities/commentSchema');
const Image = require('../entities/imageSchema');
const PostModel = require('../models/postModel');
const CommentModel = require('../models/commentModel');
const handlerFactory = require('./handlerFactory');
const Friends = require('../entities/friendsSchema');

const alias = 'post';

exports.getAllPosts = catchError(
  async ({ connection, query, params, group, user }, res, next) => {
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
    else if (group) builder.where(`${alias}.groupId = ${group.id}`);

    const posts = await builder
      .leftJoinAndSelect(`${alias}.user`, 'user')
      .leftJoinAndSelect(`${alias}.image`, 'image')
      .leftJoinAndSelect(`${alias}.group`, 'group')
      .leftJoinAndSelect(`group.creator`, 'groupCreator')
      .leftJoinAndSelect(`group.image`, 'groupImg')
      .leftJoinAndSelect('user.image', 'img')
      .select([
        ...filter.fields,
        'image.location',
        'user.username',
        'user.link',
        'img.location',
        'group.name',
        'group.link',
        'groupCreator.id',
        'groupImg.location',
      ])
      .skip(filter.offset)
      .take(filter.limit)
      .orderBy(...filter.order)
      .getMany();

    const result = posts.map((post) => {
      if (post.group) {
        if (post.group.creator.id === user.id) {
          post.group.isMine = true;
        }
        delete post.group.creator;
      }
      return post;
    });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts: result,
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
    [`${alias}.image`, 'image'],
    ['user.image', 'img'],
  ],
  select: [
    alias,
    'image.location',
    'user.username',
    'user.link',
    'user.imgId',
    'img.location',
  ],
});

// exports.createPost = handlerFactory.createOne({
//   Entity: Post,
//   Model: PostModel,
//   bodyFields: ['content'],
//   userId: 'userId',
//   constraints: postConstraints,
//   responseName: 'post',
// });

exports.createPost = catchError(
  async ({ connection, user, body, files, group }, res, next) => {
    const postModel = new PostModel(user.id, body.content);

    const validation = validate(postModel, postConstraints);
    if (validation) return next(new AppError(validation, 400));

    let imgId;
    let previewLimit;

    if (files && files.length) {
      const data = await cloud.uploadImage(files[0]);

      const newImage = await connection
        .getRepository(Image)
        .createQueryBuilder()
        .insert()
        .values(data)
        .execute();

      imgId = newImage.identifiers[0].id;
      previewLimit = Math.floor((data.height / data.width) * 1200);
    }

    const prepared = postModel.prepare();

    if (group) {
      prepared.groupId = group.id;
      prepared.userId = undefined;
    }

    await connection.getRepository(Post).save({
      ...prepared,
      imgId,
      previewLimit,
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

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

exports.updateGroupPost = handlerFactory.updateOne({
  Entity: Post,
  bodyFields: ['content'],
  constraints: postConstraints,
  where: 'link = :link AND groupId = :id AND :creatorId = :userId',
  whereSelectors: [
    ['link', 'params', 'link'],
    ['id', 'group', 'id'],
    ['creatorId', 'group', 'creatorId'],
    ['userId', 'user', 'id'],
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

exports.deleteGroupPost = handlerFactory.deleteOne({
  Entity: Post,
  where: 'link = :link AND groupId = :groupId AND :creatorId = :userId',
  whereSelectors: [
    ['link', 'params', 'link'],
    ['groupId', 'group', 'id'],
    ['creatorId', 'group', 'creatorId'],
    ['userId', 'user', 'id'],
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

exports.getNews = catchError(async ({ connection, user, query }, res, next) => {
  const friends = await connection
    .getRepository(Friends)
    .createQueryBuilder('f')
    .leftJoinAndSelect(User, 'u', 'f.friendId = u.id OR f.targetId = u.id')
    .where(
      'u.id != :id AND f.active = 1 AND (f.friendId = :id OR f.targetId = :id)',
      {
        id: user.id,
      }
    )
    .select(['u.id'])
    .getRawMany();

  const ids = friends.reduce((acc, friend) => [...acc, friend.u_id], []);

  if (!ids.length)
    return res.status(200).json({
      status: 'success',
      data: [],
    });

  const filter = apiFilter(query, alias);

  const news = await connection
    .getRepository(Post)
    .createQueryBuilder(alias)
    .leftJoinAndSelect(`${alias}.user`, 'user')
    .leftJoinAndSelect(`${alias}.image`, 'image')
    .leftJoinAndSelect('user.image', 'img')
    .where(`${alias}.userId IN (:...ids)`, { ids })
    .select([
      `${alias}.id`,
      `${alias}.content`,
      `${alias}.previewLimit`,
      `${alias}.link`,
      `${alias}.createdAt`,
      'image.location',
      'user.username',
      'user.link',
      'img.location',
    ])
    .skip(filter.offset)
    .take(filter.limit)
    .orderBy(...filter.order)
    .getMany();

  res.status(200).json({
    status: 'success',
    results: news.length,
    data: {
      news,
    },
  });
});
