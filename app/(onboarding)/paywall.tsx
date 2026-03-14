import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';
import BackButton from '../../components/BackButton';

export default function PaywallScreen() {
  const router = useRouter();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const fadeFeatures = useRef(new Animated.Value(0)).current;
  const fadeCta = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeFeatures, {
      toValue: 1,
      duration: 500,
      delay: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeCta, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  function handleUnlock() {
    // TODO: integrate RevenueCat
    router.push('/(onboarding)/complete');
  }

  function handleFree() {
    router.push('/(onboarding)/complete');
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        <Text style={styles.emoji}>🎉</Text>

        <Text style={styles.headline}>3 free scripts to try.</Text>

        <Text style={styles.price}>
          Unlimited scripts forever: $4.99
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Not a subscription. Pay once, own it.
          </Text>
        </View>

        <Animated.View style={[styles.features, { opacity: fadeFeatures }]}>
          <Text style={styles.featureItem}>✓  Unlimited AI scripts</Text>
          <Text style={styles.featureItem}>✓  Practice mode with AI caller</Text>
          <Text style={styles.featureItem}>✓  All call categories</Text>
          <Text style={styles.featureItem}>✓  Future updates included</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeCta }]}>
        <TouchableOpacity
          style={styles.cta}
          onPress={handleUnlock}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Unlock Now — $4.99</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFree} style={styles.freeLink}>
          <Text style={styles.freeLinkText}>Start with 3 Free</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 32,
  },
  badgeText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: colors.accent,
  },
  features: {
    alignSelf: 'stretch',
    gap: 14,
  },
  featureItem: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 16,
    color: colors.text,
    paddingLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  ctaText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  freeLink: {
    paddingVertical: 8,
  },
  freeLinkText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 15,
    color: colors.gray,
  },
});
