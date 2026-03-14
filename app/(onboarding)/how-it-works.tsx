import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';
import BackButton from '../../components/BackButton';

const { width } = Dimensions.get('window');

const PANELS = [
  {
    icon: '💬',
    title: 'Describe your call',
    description:
      "Tell us who you're calling and why. We'll handle the rest.",
  },
  {
    icon: '📄',
    title: 'Get your script',
    description:
      'Receive a word-for-word script with responses to common pushback.',
  },
  {
    icon: '📱',
    title: 'Practice or dial',
    description:
      'Rehearse with AI or jump straight into the real call — your choice.',
  },
];

export default function HowItWorksScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleNext() {
    if (activeIndex < PANELS.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.push('/(onboarding)/paywall');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.headline}>How It Works</Text>

      <FlatList
        ref={flatListRef}
        data={PANELS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.panel}>
            <Text style={styles.panelIcon}>{item.icon}</Text>
            <Text style={styles.panelTitle}>{item.title}</Text>
            <Text style={styles.panelDescription}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {PANELS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cta}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>
            {activeIndex === PANELS.length - 1 ? 'Continue' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  panel: {
    width,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  panelTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  panelDescription: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  cta: {
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
