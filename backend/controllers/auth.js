const jwt = require('jsonwebtoken');
const config = require('../config');

const HARDCODED_USERS = [
  { id: 'user-016', name: 'Miguel Santos', email: 'miguel.santos@gawa.ph', password: 'admin123', role: 'admin' },
  { id: 'user-017', name: 'Angela Cruz', email: 'angela.cruz@gawa.ph', password: 'support123', role: 'customer_support' },
];

const resetTokens = {};

function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = HARDCODED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiry }
  );
  const { password: _, ...userData } = user;
  res.json({ data: { token, user: userData } });
}

function requestPasswordReset(req, res) {
  const { email } = req.body;
  const user = HARDCODED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const token = Math.random().toString(36).slice(2, 10).toUpperCase();
  resetTokens[email] = { token, expiresAt: Date.now() + 3600000 };
  console.log(`[RESET] Password reset token for ${email}: ${token}`);
  res.json({ message: 'Reset link sent. Check console for token in dev mode.', resetToken: token });
}

function resetPassword(req, res) {
  const { email, token, newPassword } = req.body;
  const stored = resetTokens[email];
  if (!stored || stored.token !== token || stored.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }
  const user = HARDCODED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.password = newPassword;
  delete resetTokens[email];
  res.json({ message: 'Password reset successful' });
}

module.exports = { login, requestPasswordReset, resetPassword };
