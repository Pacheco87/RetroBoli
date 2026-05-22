import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  const header = req.get('authorization') || '';
  const [, token] = header.match(/^Bearer\s+(.+)$/i) || [];

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    req.admin = jwt.verify(token, process.env.SESSION_TOKEN_SECRET);
    next();
  } catch (_error) {
    res.status(401).json({ error: 'Invalid session' });
  }
}
