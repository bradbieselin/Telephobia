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

    // Check user limits
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_pro, free_scripts_used')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    if (!user.is_pro && user.free_scripts_used >= 3) {
      res.status(403).json({
        error: 'Free script limit reached',
        limit: 3,
        used: user.free_scripts_used,
      });
      return;
    }

    // Build user message
    let userMessage = `Situation: ${situation}`;
    if (category) userMessage += `\nCategory: ${category}`;
    if (context) userMessage += `\nAdditional context: ${context}`;

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
        situation,
        script_content: script,
        category: category || null,
      })
      .select()
      .single();

    if (saveError) {
      res.status(500).json({ error: 'Failed to save script' });
      return;
    }

    // Increment free_scripts_used for free users
    if (!user.is_pro) {
      await supabase
        .from('users')
        .update({ free_scripts_used: user.free_scripts_used + 1 })
        .eq('id', userId);
    }

    res.json({ script: savedScript });
  } catch (err: any) {
    console.error('Script generation error:', err);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

export default router;
