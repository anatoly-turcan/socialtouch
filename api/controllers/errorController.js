const AppError = require('../utils/appError');

const handleMDBError = (err) => {
  // ER_BAD_FIELD_ERROR
  if (err.original.errno === 1054) {
    const invalidField = err.message
      .substr(err.message.indexOf("'"))
      .split("'")[1];
    return new AppError(`Invalid field: ${invalidField}`, 400);
  }

  return err;
};

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
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'SequelizeDatabaseError') error = handleMDBError(error);

    sendErrorProd(error, req, res);
  }
};
