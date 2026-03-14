import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';
import BackButton from '../../components/BackButton';

export default function HookScreen() {
  const router = useRouter();
  const fadeHeadline = useRef(new Animated.Value(0)).current;
  const fadeCard = useRef(new Animated.Value(0)).current;
  const slideCard = useRef(new Animated.Value(30)).current;
  const fadeCta = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeHeadline, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(fadeCard, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideCard, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(fadeCta, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.content}>
        <Animated.Text style={[styles.headline, { opacity: fadeHeadline }]}>
          Calling to cancel your gym membership?
        </Animated.Text>

        <Animated.View
          style={[
            styles.scriptCard,
            { opacity: fadeCard, transform: [{ translateY: slideCard }] },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Your Script</Text>
            <Text style={styles.cardCategory}>🏋️ Gym Cancellation</Text>
          </View>

          <View style={styles.scriptSection}>
            <Text style={styles.sectionLabel}>Opening</Text>
            <Text style={styles.sectionText}>
              "Hi, I'm calling to cancel my membership. My member ID is [your ID].
              I'd like to process that today."
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.scriptSection}>
            <Text style={styles.ifLabel}>If they say:</Text>
            <View style={styles.theyBubble}>
              <Text style={styles.bubbleText}>
                "We can offer you a discount to stay."
              </Text>
            </View>
          </View>

          <View style={styles.scriptSection}>
            <Text style={styles.youLabel}>You say:</Text>
            <View style={styles.youBubble}>
              <Text style={styles.bubbleText}>
                "I appreciate that, but I've made my decision. Please go ahead
                and cancel."
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity: fadeCta }]}>
        <TouchableOpacity
          onPress={() => router.push('/(onboarding)/personalize')}
          activeOpacity={0.7}
        >
          <Text style={styles.ctaText}>That's what I get? →</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 26,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 28,
  },
  scriptCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: colors.primary,
  },
  cardCategory: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 13,
    color: colors.gray,
  },
  scriptSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  sectionText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  ifLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  youLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  theyBubble: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    borderTopLeftRadius: 4,
    padding: 12,
  },
  youBubble: {
    backgroundColor: '#CCFBF1',
    borderRadius: 14,
    borderTopRightRadius: 4,
    padding: 12,
  },
  bubbleText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: colors.primary,
  },
});
