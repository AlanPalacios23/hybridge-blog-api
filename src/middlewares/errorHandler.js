class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function errorHandler(error, _req, res, _next) {
  const isOperational = error instanceof AppError;
  const statusCode = isOperational ? error.statusCode : 500;

  if (!isOperational) {
    console.error(error);
  }

  const response = {
    success: false,
    error: {
      code: isOperational ? error.code : 'INTERNAL_ERROR',
      message: isOperational ? error.message : 'Ocurrió un error interno en el servidor.',
    },
  };

  if (isOperational && error.details) {
    response.error.details = error.details;
  }

  if (process.env.NODE_ENV === 'development' && !isOperational) {
    response.error.stack = error.stack;
  }

  return res.status(statusCode).json(response);
}

module.exports = { AppError, errorHandler };
