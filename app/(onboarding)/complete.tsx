import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../lib/AuthContext';
import { setOnboardingComplete, createUserProfile } from '../../lib/onboarding';
import { colors } from '../../constants/theme';

export default function CompleteScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function finish() {
      try {
        const name = (await AsyncStorage.getItem('telephobia_onboarding_name')) ?? '';
        const areasJson = await AsyncStorage.getItem('telephobia_onboarding_areas');
        const areas: string[] = areasJson ? JSON.parse(areasJson) : [];

        if (user) {
          await createUserProfile(user.id, name, areas);
        }

        await setOnboardingComplete();

        // Clean up temp storage
        await AsyncStorage.multiRemove([
          'telephobia_onboarding_name',
          'telephobia_onboarding_areas',
        ]);
      } catch {
        // Still proceed even if profile creation fails
      }

      router.replace('/');
    }

    finish();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
});
