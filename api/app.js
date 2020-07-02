const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/postRoutes.js');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

module.exports = (connection) => {
  const app = express();

  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  app.use((req, res, next) => {
    req.connection = connection;
    next();
  });

  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  app.use('/api/v1/auth', authRouter);

  // Only for logged users
  app.use(authController.protect);
  app.use('/api/v1/posts', postRouter);
  app.use('/api/v1/users', userRouter);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
  });

  app.use(globalErrorHandler);

  return app;
};

// const express = require('express');
// const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
// // const sequelize = require('./config/sequelize');
// const globalErrorHandler = require('./controllers/errorController');
// const authController = require('./controllers/authController');
// const postRouter = require('./routes/postRoutes.js');
// const authRouter = require('./routes/authRoutes.js');
// const userRouter = require('./routes/userRoutes');
// // typeorm
// const getConnection = require('./config/typeorm');

// const AppError = require('./utils/appError.js');

// const app = express();

// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// app.use(async (req, res, next) => {
//   // req.db = sequelize;
//   req.db = await getConnection();
//   next();
// });

// app.use(express.json({ limit: '10kb' }));
// app.use(cookieParser());

// // app.use('/api/v1/auth', authRouter);

// // Only for logged users
// // app.use(authController.protect);
// app.use('/api/v1/posts', postRouter);
// // app.use('/api/v1/users', userRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
// });

// app.use(globalErrorHandler);

// module.exports = app;
