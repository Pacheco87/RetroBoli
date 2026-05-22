import { Router } from 'express';

import { requireAdmin } from '../middleware/auth.js';
import { loginAdmin } from '../services/authService.js';

export const adminAuthRouter = Router();

adminAuthRouter.post('/login', async (req, res, next) => {
  try {
    const token = await loginAdmin(req.body.username, req.body.password);

    if (!token) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

adminAuthRouter.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: { username: req.admin.username } });
});
