import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, font, radius } from '@/src/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={48} color="#9CA3AF" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.btn} onPress={onAction}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 40, gap: spacing.lg,
  },
  iconWrap: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#F1EFE8', justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: font.lg, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  desc: { fontSize: font.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, paddingHorizontal: 24, marginTop: spacing.sm,
  },
  btnText: { fontSize: font.base, fontWeight: '700', color: '#fff' },
});