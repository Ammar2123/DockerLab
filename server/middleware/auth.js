const jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
  // Check for token in headers first (standard approach)
  const headerToken = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check for token in request body (fallback)
  const bodyToken = req.body.token;
  
  // Use whichever token is available
  const token = headerToken || bodyToken;
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { isAdmin };