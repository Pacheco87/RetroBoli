import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function loginAdmin(username, password) {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
    throw new Error('Admin credentials are not configured');
  }

  if (!process.env.SESSION_TOKEN_SECRET) {
    throw new Error('SESSION_TOKEN_SECRET is required');
  }

  const usernameMatches = username === process.env.ADMIN_USERNAME;
  const passwordMatches = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

  if (!usernameMatches || !passwordMatches) {
    return null;
  }

  return jwt.sign({ role: 'admin', username }, process.env.SESSION_TOKEN_SECRET, {
    expiresIn: '8h',
  });
}
