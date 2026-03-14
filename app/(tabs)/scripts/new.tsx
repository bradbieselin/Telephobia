import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../../constants/theme';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import BackButton from '../../../components/BackButton';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

const CATEGORIES = [
  'Medical',
  'Housing',
  'Work',
  'Money',
  'Auto',
  'Government',
  'Personal',
] as const;

export default function NewScriptScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [situation, setSituation] = useState('');
  const [category, setCategory] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [theirName, setTheirName] = useState('');
  const [yourName, setYourName] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  async function handleGenerate() {
    if (!situation.trim()) return;

    if (!API_URL) {
      Alert.alert('Configuration Error', 'API URL is not configured. Please set EXPO_PUBLIC_API_URL.');
      return;
    }

    setLoading(true);

    try {
      const contextParts: string[] = [];
      if (theirName.trim()) contextParts.push(`Their name/company: ${theirName.trim()}`);
      if (yourName.trim()) contextParts.push(`My name: ${yourName.trim()}`);
      if (specificDetails.trim()) contextParts.push(specificDetails.trim());
      const contextStr = contextParts.length > 0 ? contextParts.join('. ') : undefined;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch(`${API_URL}/api/scripts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          situation: situation.trim(),
          category: category || undefined,
          context: contextStr,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 403) {
          throw new Error("You've used all 3 free scripts. Upgrade to Pro for unlimited scripts.");
        }
        throw new Error(err.error || 'Failed to generate script');
      }

      const data = await res.json();
      router.replace(`/(tabs)/scripts/${data.script.id}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      Alert.alert('Error', message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Writing your script...</Text>
          <Text style={styles.loadingSubtext}>
            This usually takes a few seconds
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeIn }}>
            <Text style={styles.heading}>New Script</Text>

            <Text style={styles.label}>
              What call do you need to make?
            </Text>
            <TextInput
              style={styles.situationInput}
              placeholder="e.g. Cancel my gym membership at Planet Fitness"
              placeholderTextColor={colors.gray}
              value={situation}
              onChangeText={setSituation}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.detailsToggle}
              onPress={() => setShowDetails((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsToggleText}>
                {showDetails ? '− Hide details' : '+ Add details'}
              </Text>
            </TouchableOpacity>

            {showDetails && (
              <View style={styles.detailsSection}>
                <Text style={styles.detailLabel}>
                  Their name / company
                </Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="e.g. Planet Fitness"
                  placeholderTextColor={colors.gray}
                  value={theirName}
                  onChangeText={setTheirName}
                />

                <Text style={styles.detailLabel}>Your name</Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="Your name"
                  placeholderTextColor={colors.gray}
                  value={yourName}
                  onChangeText={setYourName}
                />

                <Text style={styles.detailLabel}>
                  Any specific details
                </Text>
                <TextInput
                  style={[styles.detailInput, styles.detailInputTall]}
                  placeholder="e.g. I've been a member for 2 years, monthly plan"
                  placeholderTextColor={colors.gray}
                  value={specificDetails}
                  onChangeText={setSpecificDetails}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            )}

            <Text style={styles.label}>Category</Text>
            <View style={styles.pillGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() =>
                      setCategory((prev) => (prev === cat ? '' : cat))
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.generateBtn, !situation.trim() && styles.btnDisabled]}
            onPress={handleGenerate}
            activeOpacity={0.8}
            disabled={!situation.trim()}
          >
            <Text style={styles.generateBtnText}>Generate My Script</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },
  heading: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  situationInput: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    minHeight: 100,
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  detailsToggle: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  detailsToggleText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: colors.primary,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  detailInput: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.text,
  },
  detailInputTall: {
    minHeight: 80,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: colors.card,
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
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  generateBtn: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  generateBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: colors.text,
    marginTop: 20,
  },
  loadingSubtext: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.gray,
    marginTop: 8,
  },
});
