import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/AuthContext';
import { isOnboardingComplete } from '../lib/onboarding';
import { colors } from '../constants/theme';

export default function IndexScreen() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    isOnboardingComplete().then(setOnboardingDone);
  }, []);

  useEffect(() => {
    if (loading || onboardingDone === null) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/sign-in');
    } else if (!onboardingDone) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isAuthenticated, loading, onboardingDone]);

  // Still loading
  if (loading || onboardingDone === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Authenticated + onboarded = home screen
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Telephobia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
    color: colors.text,
  },
});
