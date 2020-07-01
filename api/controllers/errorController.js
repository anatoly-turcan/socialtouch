const AppError = require('../utils/appError');

const handleMDBError = (err) => {
  // ER_BAD_FIELD_ERROR
  if (err.original.errno === 1054) {
    const invalidField = err.message
      .substr(err.message.indexOf("'"))
      .split("'")[1];
    return new AppError(`Invalid field: ${invalidField}`, 400);
  }

  if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  )
    return new AppError(err.errors[0].message, 400);

  return err;
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    // if (process.env.NODE_ENV === 'development') {
    let error = { ...err };
    error.message = err.message;

    if (err.name.startsWith('Sequelize')) error = handleMDBError(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
