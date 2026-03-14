import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const ONBOARDING_KEY = 'telephobia_onboarding_complete';

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function createUserProfile(
  userId: string,
  name: string,
  anxietyAreas: string[]
): Promise<void> {
  const { error } = await supabase.from('users').upsert({
    id: userId,
    name,
    anxiety_areas: anxietyAreas,
  });

  if (error) throw error;
}
