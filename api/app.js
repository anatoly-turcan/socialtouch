const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const multer = require('multer');
const { getConnection } = require('typeorm');
const postRouter = require('./routes/postRoutes.js');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const groupRouter = require('./routes/groupRoutes');
const chatRouter = require('./routes/chatRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());
app.use((req, res, next) => {
  req.connection = getConnection();
  next();
});

app.use('/api/v1/auth', authRouter);

app.use(multer().any());

// Only for logged users
app.use(authController.protect);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/chats', chatRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
