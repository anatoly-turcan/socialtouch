// const apiFilter = require('../utils/apiFilter');
const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const postConstraints = require('../validators/postConstraints');
const Post = require('../entities/postSchema');
const User = require('../entities/userSchema');
const PostModel = require('../models/postModel');
const handlerFactory = require('./handlerFactory');

const alias = 'post';

exports.getAllPosts = catchError(
  async ({ connection, query, params }, res, next) => {
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

          return `${alias}.user_id = ${subQuery}`;
        })
        .setParameter('link', params.link);
    else
      builder
        .leftJoinAndSelect(`${alias}.user`, 'user')
        .select([
          ...filter.fields,
          'user.username',
          'user.link',
          'user.img_id',
        ]);

    const posts = await builder
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
  join: [`${alias}.user`, 'user'],
  joinSelectors: ['user.username', 'user.link', 'user.img_id'],
});

exports.createPost = handlerFactory.createOne({
  Entity: Post,
  Model: PostModel,
  bodyFields: ['content'],
  userId: 'user_id',
  constraints: postConstraints,
  responseName: 'post',
});

exports.updatePost = handlerFactory.updateOne({
  Entity: Post,
  bodyFields: ['content'],
  constraints: postConstraints,
  where: 'link = :link AND user_id = :id',
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
