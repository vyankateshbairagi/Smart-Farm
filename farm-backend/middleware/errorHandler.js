const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate field value' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorHandler;
