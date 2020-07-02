const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const apiFilter = require('../utils/apiFilter');
const User = require('../entities/userSchema');

exports.getAllUsers = catchError(async ({ connection, query }, res, next) => {
  const filter = apiFilter(query, 'user');

  const users = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .select([...filter.fields])
    .skip(filter.offset)
    .take(filter.limit)
    .orderBy(...filter.order)
    .getMany();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchError(async ({ connection, params }, res, next) => {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .select('user')
    .where('user.link = :link', { link: params.link })
    .getOne();

  if (process.env.NODE_ENV === 'production') delete user.id;

  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
