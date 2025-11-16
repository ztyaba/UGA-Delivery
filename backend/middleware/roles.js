function authorizeRoles (...allowedRoles) {
  return function roleCheck (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = authorizeRoles;
