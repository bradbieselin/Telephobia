import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/practice/message
router.post('/message', requireAuth, async (_req: Request, res: Response) => {
  // TODO: implement practice roleplay
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
