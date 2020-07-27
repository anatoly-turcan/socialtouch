const AppError = require('../utils/appError');

const handleSqlDuplicateFieldError = ({ message }) => {
  if (message.indexOf('PRIMARY') !== -1)
    return new AppError('You have already done it', 400);

  const field = message.split("'")[1];

  return new AppError(`'${field}' is already in use`, 400);
};

const handleSqlBadFieldError = ({ message }) => {
  const field = message.split("'")[1].split('.')[1];

  return new AppError(`Wrong field: '${field}'`, 400);
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
  else {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 'ER_DUP_ENTRY')
      error = handleSqlDuplicateFieldError(error);
    if (err.code === 'ER_BAD_FIELD_ERROR')
      error = handleSqlBadFieldError(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
