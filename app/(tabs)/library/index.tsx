import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/theme';

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.center}>
        <Ionicons name="grid-outline" size={64} color="#D1D5DB" />
        <Text style={styles.title}>Script Library</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
        <Text style={styles.description}>
          Browse pre-made scripts for common calls — ready to use in seconds.
        </Text>
      </View>
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
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: colors.primary,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
