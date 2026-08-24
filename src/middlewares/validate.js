const { AppError } = require('./errorHandler');

function validate(schema) {
  return function validationMiddleware(req, _res, next) {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(new AppError('Los datos enviados no son válidos.', 400, 'VALIDATION_ERROR', details));
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = { validate };
