const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer Token

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Use JWT_SECRET from .env
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = decoded; // Attach user data to request object
    next();
  });
};

module.exports = authenticateToken;
