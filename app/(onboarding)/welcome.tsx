import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const fadeContent = useRef(new Animated.Value(0)).current;
  const fadeCta = useRef(new Animated.Value(0)).current;
  const slideCta = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeContent, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(fadeCta, {
        toValue: 1,
        duration: 500,
        delay: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideCta, {
        toValue: 0,
        duration: 500,
        delay: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeContent }]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Text style={styles.phoneIcon}>📞</Text>
        </Animated.View>

        <Text style={styles.logo}>Telephobia</Text>

        <Text style={styles.headline}>
          Phone calls don't have to be scary.
        </Text>

        <Text style={styles.subtext}>
          Get AI-powered scripts for any call.{'\n'}
          Practice before you dial. Never freeze again.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          { opacity: fadeCta, transform: [{ translateY: slideCta }] },
        ]}
      >
        <TouchableOpacity
          style={styles.ctaWrapper}
          onPress={() => router.push('/(onboarding)/hook')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Get Started</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  phoneIcon: {
    fontSize: 72,
    marginBottom: 24,
  },
  logo: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 42,
    color: colors.primary,
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  ctaWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
