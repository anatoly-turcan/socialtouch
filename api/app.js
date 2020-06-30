const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/postRoutes.js');
const sequelize = require('./config/sequelize');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  req.db = sequelize;
  next();
});

app.use(express.static('./public'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/v1/posts', postRouter);

module.exports = app;
