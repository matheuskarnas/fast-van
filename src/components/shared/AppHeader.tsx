import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, font } from '@/src/theme';

interface Props {
  nome?: string;
  onLogout: () => void;
  onNotification?: () => void;
  rightElement?: React.ReactNode; // para casos com botões extras
}

function getNomeHora(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getDataFormatada(): string {
  const d = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export function AppHeader({ nome, onLogout, onNotification, rightElement }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting}>
          {getNomeHora()}{nome ? `, ${nome.split(' ')[0]}` : ''}
        </Text>
        <Text style={styles.date}>{getDataFormatada()}</Text>
      </View>

      <View style={styles.actions}>
        {rightElement}
        <TouchableOpacity style={styles.iconBtn} onPress={onNotification}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingTop: 56, paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  left: { gap: 2 },
  greeting: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  date: { fontSize: font.sm, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center',
  },
});