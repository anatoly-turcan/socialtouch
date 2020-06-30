const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/postRoutes.js');
const sequelize = require('./config/sequelize');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError.js');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  req.db = sequelize;
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/v1/posts', postRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
