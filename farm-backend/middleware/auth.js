const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET is not configured' });
  }

  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
