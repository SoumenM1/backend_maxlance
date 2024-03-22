// authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get the token from the request headers
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'soumen maity key');

    // Extract user ID from the decoded token payload
    const userId = decoded.id;
    const email = decoded.email;
    // Attach the user ID to the request object
    req.userId = userId;
    req.email = email;
    const itemId = req.params.itemId || 0;
   // Attach the item ID to the request object
    req.itemId = itemId;

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

module.exports = authMiddleware;
