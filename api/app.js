const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const postRouter = require('./routes/postRoutes.js');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const groupRouter = require('./routes/groupRoutes');

const upload = multer({
  limits: {
    fieldSize: 10485760,
  },
});

module.exports = (connection) => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.options('*', cors());

  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  app.use((req, res, next) => {
    req.connection = connection;
    next();
  });

  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  app.use('/api/v1/auth', authRouter);

  app.use(upload.any());

  // Only for logged users
  app.use(authController.protect);
  app.use('/api/v1/posts', postRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/groups', groupRouter);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
  });

  app.use(globalErrorHandler);

  return app;
};
