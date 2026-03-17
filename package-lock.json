const logger = require('../utils/logger');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.error('Validation error:', error.details[0].message);
      return res.status(400).json({
        error: 'Validation failed',
        message: error.details[0].message
      });
    }
    next();
  };
};

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
};

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
};

module.exports = {
  validate,
  requestLogger,
  errorHandler
};