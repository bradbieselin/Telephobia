import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '../../../constants/theme';
import { supabase } from '../../../lib/supabase';
import BackButton from '../../../components/BackButton';
import ScriptCard from '../../../components/ScriptCard';
import type { Script } from '../../../types/database';

export default function ScriptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScript = useCallback(async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setScript(data as Script);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchScript();
  }, [fetchScript]);

  async function handleToggleFavorite() {
    if (!script) return;

    const previousValue = script.is_favorite;
    const newValue = !previousValue;
    setScript({ ...script, is_favorite: newValue });

    const { error } = await supabase
      .from('scripts')
      .update({ is_favorite: newValue })
      .eq('id', script.id);

    if (error) {
      // Rollback optimistic update on failure
      setScript((prev) => prev ? { ...prev, is_favorite: previousValue } : prev);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!script) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton />
        <View style={styles.center}>
          <Text style={styles.errorText}>Script not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const content = script.script_content as {
    opening?: string;
    keyPoints?: string[];
    ifTheySay?: Array<{ theySay: string; youSay: string }>;
    closing?: string;
    confidenceNote?: string;
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.headerSpacer} />
      <Text style={styles.situation}>{script.situation}</Text>
      <ScriptCard
        content={content}
        phoneNumber={script.phone_number}
        isFavorite={script.is_favorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    height: 40,
  },
  situation: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: colors.text,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: colors.gray,
  },
});
