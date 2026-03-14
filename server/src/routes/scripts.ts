import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/scripts/generate
router.post('/generate', requireAuth, async (_req: Request, res: Response) => {
  // TODO: implement script generation
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
