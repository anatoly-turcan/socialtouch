const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const apiFilter = require('../utils/apiFilter');

exports.getAllUsers = catchError(async ({ User, query }, res, next) => {
  const users = await User.findAll(apiFilter(query, User));

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = catchError(async ({ User, params }, res, next) => {
  const user = await User.findOne({
    where: { link: params.link },
    ...apiFilter(null, User),
  });

  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
