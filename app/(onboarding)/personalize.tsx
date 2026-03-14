import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/theme';
import BackButton from '../../components/BackButton';

const ANXIETY_OPTIONS = [
  'Doctor',
  'Work',
  'Landlord',
  'Bills',
  'Customer Service',
  'Government',
  'Other',
];

const ONBOARDING_NAME_KEY = 'telephobia_onboarding_name';
const ONBOARDING_AREAS_KEY = 'telephobia_onboarding_areas';

export default function PersonalizeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const fadeHeadline = useRef(new Animated.Value(0)).current;
  const fadePills = useRef(new Animated.Value(0)).current;
  const fadeName = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeHeadline, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadePills, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeName, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  function toggleArea(area: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleContinue() {
    if (!name.trim()) {
      Alert.alert('', 'Please enter your first name.');
      return;
    }

    await AsyncStorage.setItem(ONBOARDING_NAME_KEY, name.trim());
    await AsyncStorage.setItem(ONBOARDING_AREAS_KEY, JSON.stringify(selected));

    router.push('/(onboarding)/how-it-works');
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.content}>
        <Animated.Text style={[styles.headline, { opacity: fadeHeadline }]}>
          What calls stress you out?
        </Animated.Text>

        <Animated.View style={[styles.pillGrid, { opacity: fadePills }]}>
          {ANXIETY_OPTIONS.map((area) => {
            const isSelected = selected.includes(area);
            return (
              <TouchableOpacity
                key={area}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => toggleArea(area)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}
                >
                  {area}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <Animated.View style={[styles.nameSection, { opacity: fadeName }]}>
          <Text style={styles.nameLabel}>What's your first name?</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="First name"
            placeholderTextColor={colors.gray}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cta, !name.trim() && styles.ctaDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Continue</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 28,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 36,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: colors.background,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: colors.text,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  nameSection: {
    gap: 8,
  },
  nameLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  nameInput: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
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
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
