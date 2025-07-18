const jwt = require('jsonwebtoken');
function isAdmin(req, res, next) {
  const token = req.body.token
  if (!token) return res.status(403).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
module.exports = { isAdmin };