const { AppError } = require('./errorHandler');

function notFound(req, _res, next) {
  next(new AppError(`No existe la ruta ${req.method} ${req.originalUrl}.`, 404, 'ROUTE_NOT_FOUND'));
}

module.exports = { notFound };
