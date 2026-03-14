import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth';
import { callClaude } from '../services/claude';
import { SCRIPT_GENERATOR_PROMPT } from '../prompts/scriptGenerator';

const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
);

const router = Router();

const ALLOWED_CATEGORIES = [
  'Medical',
  'Housing',
  'Work',
  'Money',
  'Auto',
  'Government',
  'Personal',
];

const MAX_SITUATION_LENGTH = 500;
const MAX_CONTEXT_LENGTH = 500;

/** Strip attempts to inject system/assistant role markers from user input. */
function sanitizeInput(input: string): string {
  return input
    .replace(/\b(system|assistant)\s*:/gi, '')
    .replace(/<\|.*?\|>/g, '')
    .trim();
}

interface ScriptResponse {
  opening: string;
  keyPoints: string[];
  ifTheySay: { theySay: string; youSay: string }[];
  closing: string;
  confidenceNote: string;
}

function parseScriptJson(text: string): ScriptResponse {
  // Strip markdown fences if Claude wraps them
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(cleaned);

  if (
    !parsed.opening ||
    !Array.isArray(parsed.keyPoints) ||
    !Array.isArray(parsed.ifTheySay) ||
    !parsed.closing ||
    !parsed.confidenceNote
  ) {
    throw new Error('Invalid script structure');
  }

  return parsed as ScriptResponse;
}

// POST /api/scripts/generate
router.post('/generate', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { situation, category, context } = req.body;

    if (!situation || typeof situation !== 'string') {
      res.status(400).json({ error: 'situation is required' });
      return;
    }

    if (situation.length > MAX_SITUATION_LENGTH) {
      res.status(400).json({ error: `situation must be at most ${MAX_SITUATION_LENGTH} characters` });
      return;
    }

    if (context !== undefined && typeof context === 'string' && context.length > MAX_CONTEXT_LENGTH) {
      res.status(400).json({ error: `context must be at most ${MAX_CONTEXT_LENGTH} characters` });
      return;
    }

    if (category !== undefined && !ALLOWED_CATEGORIES.includes(category)) {
      res.status(400).json({ error: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}` });
      return;
    }

    // Atomically claim a free script slot (or pass through for pro users).
    // The RPC returns the updated user row only if the limit check passes.
    const { data: claimedUser, error: claimError } = await supabase.rpc(
      'claim_free_script',
      { user_id: userId }
    );

    if (claimError || !claimedUser) {
      // Could be "not found" or "limit reached"
      const msg = claimError?.message ?? 'User profile not found';
      const status = msg.includes('limit reached') ? 403 : 404;
      if (status === 403) {
        res.status(403).json({
          error: 'Free script limit reached',
          limit: 3,
          used: 3,
        });
      } else {
        res.status(status).json({ error: msg });
      }
      return;
    }

    // Sanitize user input to prevent prompt injection
    const cleanSituation = sanitizeInput(situation);
    const cleanContext = context ? sanitizeInput(context) : undefined;

    // Build user message
    let userMessage = `Situation: ${cleanSituation}`;
    if (category) userMessage += `\nCategory: ${category}`;
    if (cleanContext) userMessage += `\nAdditional context: ${cleanContext}`;

    // Call Claude with one retry on parse failure
    let script: ScriptResponse;
    try {
      const response = await callClaude(SCRIPT_GENERATOR_PROMPT, userMessage);
      script = parseScriptJson(response);
    } catch {
      const retry = await callClaude(SCRIPT_GENERATOR_PROMPT, userMessage);
      script = parseScriptJson(retry);
    }

    // Save to database
    const { data: savedScript, error: saveError } = await supabase
      .from('scripts')
      .insert({
        user_id: userId,
        situation: cleanSituation,
        script_content: script,
        category: category || null,
      })
      .select()
      .single();

    if (saveError) {
      res.status(500).json({ error: 'Failed to save script' });
      return;
    }

    res.json({ script: savedScript });
  } catch (err: unknown) {
    console.error('Script generation error:', err);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

export default router;
