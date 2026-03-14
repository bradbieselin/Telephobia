import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { colors } from '../../../constants/theme';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import type { Script } from '../../../types/database';

const CATEGORY_ICONS: Record<string, string> = {
  Medical: '🏥',
  Housing: '🏠',
  Work: '💼',
  Money: '💰',
  Auto: '🚗',
  Government: '🏛️',
  Personal: '👤',
};

export default function ScriptsListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const fetchScripts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    let query = supabase
      .from('scripts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (favoritesOnly) {
      query = query.eq('is_favorite', true);
    }

    const { data, error } = await query;

    if (!error && data) {
      setScripts(data as Script[]);
    }
    setLoading(false);
  }, [user, favoritesOnly]);

  useFocusEffect(
    useCallback(() => {
      fetchScripts();
    }, [fetchScripts])
  );

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function renderItem({ item }: { item: Script }) {
    const icon = CATEGORY_ICONS[item.category ?? ''] ?? '📋';
    return (
      <TouchableOpacity
        style={styles.scriptRow}
        onPress={() => router.push(`/(tabs)/scripts/${item.id}`)}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryIcon}>{icon}</Text>
        <View style={styles.scriptInfo}>
          <Text style={styles.scriptSituation} numberOfLines={2}>
            {item.situation}
          </Text>
          <Text style={styles.scriptDate}>{formatDate(item.created_at)}</Text>
        </View>
        {item.is_favorite && <Text style={styles.favoriteIcon}>{'⭐'}</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Scripts</Text>
        <TouchableOpacity
          style={[styles.filterBtn, favoritesOnly && styles.filterBtnActive]}
          onPress={() => setFavoritesOnly((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              favoritesOnly && styles.filterTextActive,
            ]}
          >
            {'⭐ Favorites'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : scripts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>{'📝'}</Text>
          <Text style={styles.emptyTitle}>No scripts yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={scripts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/scripts/new')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: colors.text,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: colors.card,
  },
  filterBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: colors.gray,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.gray,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  scriptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  scriptInfo: {
    flex: 1,
  },
  scriptSituation: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  scriptDate: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.gray,
  },
  favoriteIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 32,
  },
});
