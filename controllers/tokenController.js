const crypto = require('crypto');
const RefreshToken = require('../models/refreshToken');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  // Verify refresh token
  const refreshTokenRecord = await RefreshToken.findOne({ where: { token: refreshToken } });
  if (!refreshTokenRecord) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  // Verify user associated with the refresh token
  const user = await User.findByPk(refreshTokenRecord.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate a new access token
  const accessToken = jwt.sign({ id: user.id }, 'soumen maity key', { expiresIn: '1h' });

  // Return the new access token to the client
  res.json({ accessToken });
}

function generateRefreshToken(userId) {
  // Generate a random token string
  const token = crypto.randomBytes(40).toString('hex');

  // Store the token in the database
  const refreshToken = RefreshToken.create({
    token: token,
    userId: userId
  });

  return token;
}

module.exports = { generateRefreshToken,refreshToken };
