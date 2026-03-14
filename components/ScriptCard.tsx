import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { colors } from '../constants/theme';

interface ScriptSection {
  opening?: string;
  keyPoints?: string[];
  ifTheySay?: Array<{ theySay: string; youSay: string }>;
  closing?: string;
  confidenceNote?: string;
}

interface ScriptCardProps {
  content: ScriptSection;
  phoneNumber?: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPractice?: () => void;
}

export default function ScriptCard({
  content,
  phoneNumber,
  isFavorite,
  onToggleFavorite,
  onPractice,
}: ScriptCardProps) {
  function handleCallNow() {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Save / Favorite */}
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={onToggleFavorite}
        activeOpacity={0.7}
      >
        <Text style={styles.favoriteIcon}>
          {isFavorite ? '🔖' : '🏷️'}
        </Text>
        <Text style={styles.favoriteText}>
          {isFavorite ? 'Saved' : 'Save Script'}
        </Text>
      </TouchableOpacity>

      {/* OPENING */}
      {content.opening ? (
        <View style={styles.openingCard}>
          <View style={styles.openingBorder} />
          <View style={styles.openingContent}>
            <Text style={styles.sectionTitle}>OPENING</Text>
            <Text style={styles.openingText}>{content.opening}</Text>
          </View>
        </View>
      ) : null}

      {/* KEY POINTS */}
      {content.keyPoints && content.keyPoints.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>KEY POINTS</Text>
          {content.keyPoints.map((point, idx) => (
            <View key={idx} style={styles.keyPointRow}>
              <Text style={styles.keyPointNumber}>{idx + 1}.</Text>
              <Text style={styles.keyPointText}>{point}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* IF THEY SAY... */}
      {content.ifTheySay && content.ifTheySay.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>IF THEY SAY...</Text>
          {content.ifTheySay.map((item, idx) => (
            <View key={idx} style={styles.ifTheySayCard}>
              <Text style={styles.theySayLabel}>They say:</Text>
              <Text style={styles.theySayText}>{item.theySay}</Text>
              <Text style={styles.youSayLabel}>You say:</Text>
              <Text style={styles.youSayText}>{item.youSay}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* CLOSING */}
      {content.closing ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>CLOSING</Text>
          <Text style={styles.closingText}>{content.closing}</Text>
        </View>
      ) : null}

      {/* CONFIDENCE NOTE */}
      {content.confidenceNote ? (
        <View style={styles.confidenceCard}>
          <Text style={styles.confidenceText}>{content.confidenceNote}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.actions}>
        {onPractice ? (
          <TouchableOpacity
            style={styles.practiceBtn}
            onPress={onPractice}
            activeOpacity={0.8}
          >
            <Text style={styles.practiceBtnText}>Practice This Call</Text>
          </TouchableOpacity>
        ) : null}

        {phoneNumber ? (
          <TouchableOpacity
            style={styles.callBtn}
            onPress={handleCallNow}
            activeOpacity={0.8}
          >
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  favoriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  favoriteIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  favoriteText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  openingCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  openingBorder: {
    width: 4,
    backgroundColor: colors.primary,
  },
  openingContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: colors.gray,
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  openingText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 17,
    color: colors.text,
    lineHeight: 26,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  keyPointRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  keyPointNumber: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.primary,
    width: 24,
  },
  keyPointText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  ifTheySayCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  theySayLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  theySayText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  youSayLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  youSayText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: colors.primary,
    lineHeight: 22,
  },
  closingText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  confidenceCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  confidenceText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#92400E',
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 10,
  },
  practiceBtn: {
    backgroundColor: colors.accent,
    borderRadius: 28,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  practiceBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: '#FFFFFF',
  },
  callBtn: {
    backgroundColor: '#10B981',
    borderRadius: 28,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: '#FFFFFF',
  },
});
