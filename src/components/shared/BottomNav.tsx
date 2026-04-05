import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/src/theme';

type Tab = {
  id: string;
  icon: string;
  label: string;
  route: string;
};

const tabsByRole: Record<string, Tab[]> = {
  passageiro: [
    { id: 'home',      icon: 'home',                label: 'Início',       route: '/(passageiro)/home' },
    { id: 'linhas',    icon: 'bus',                 label: 'Minhas Linhas',route: '/(passageiro)/linhas' },
    { id: 'chat',      icon: 'chatbubble-ellipses', label: 'Chat',         route: '/(passageiro)/chat' },
    { id: 'historico', icon: 'time',                label: 'Histórico',    route: '/(passageiro)/historico' },
  ],
  motorista: [
    { id: 'home',      icon: 'home',                label: 'Início',       route: '/(motorista)/home' },
    { id: 'linhas',    icon: 'bus',                 label: 'Minhas Linhas',route: '/(motorista)/linhas' },
    { id: 'chat',      icon: 'chatbubble-ellipses', label: 'Chat',         route: '/(motorista)/chat' },
    { id: 'relatorios',icon: 'bar-chart',           label: 'Relatórios',   route: '/(motorista)/relatorios' },
  ],
  dono: [
    { id: 'home',       icon: 'home',               label: 'Início',       route: '/(dono)/home' },
    { id: 'frota',      icon: 'bus',                label: 'Frota',        route: '/(dono)/frota' },
    { id: 'linhas',     icon: 'map',                label: 'Linhas',       route: '/(dono)/linhas' },
    { id: 'chat',       icon: 'chatbubble-ellipses',label: 'Chat',         route: '/(dono)/chat' },
    { id: 'relatorios', icon: 'bar-chart',          label: 'Relatórios',   route: '/(dono)/relatorios' },
  ],
};

interface Props {
  role: 'passageiro' | 'motorista' | 'dono';
  active: string;
}

export function BottomNav({ role, active }: Props) {
  const router = useRouter();
  const tabs = tabsByRole[role] ?? tabsByRole.passageiro;

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.item}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={(isActive ? tab.icon : `${tab.icon}-outline`) as any}
              size={22}
              color={isActive ? colors.primary : '#9CA3AF'}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.borderLight,
    paddingBottom: 20, paddingTop: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 10, color: '#9CA3AF' },
  labelActive: { color: colors.primary, fontWeight: '600' },
});