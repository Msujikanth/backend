const jwt = require('jsonwebtoken');

// Middleware to verify JWT and user role
const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // Get token from the header
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, 'yourSecretToken');
      req.user = decoded.user;

      // Check if the user has the required role
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ msg: 'Access denied' });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};

module.exports = authMiddleware;
