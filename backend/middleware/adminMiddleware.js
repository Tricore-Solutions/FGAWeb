// Admin middleware - requires authentication AND admin role
const adminMiddleware = (req, res, next) => {
  try {
    // First check if user is authenticated (req.user should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // User is authenticated and is an admin - proceed
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization error' });
  }
};

module.exports = adminMiddleware;

