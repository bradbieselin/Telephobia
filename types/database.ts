export interface User {
  id: string;
  name: string | null;
  anxiety_areas: string[];
  is_pro: boolean;
  free_scripts_used: number;
  created_at: string;
}

export interface Script {
  id: string;
  user_id: string;
  situation: string;
  script_content: Record<string, unknown>;
  category: string | null;
  phone_number: string | null;
  is_favorite: boolean;
  created_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  script_id: string;
  messages: Record<string, unknown>[];
  feedback: string | null;
  mode: 'text' | 'voice';
  created_at: string;
}
