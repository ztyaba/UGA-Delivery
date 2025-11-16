function auth (req, res, next) {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');

  if (!userId || !role) {
    return res.status(401).json({ message: 'Authentication required via x-user-id and x-user-role headers' });
  }

  req.user = {
    id: userId,
    role
  };

  next();
}

module.exports = auth;
