// app/(passageiro)/home.tsx — versão refatorada
import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { AppHeader } from '@/src/components/shared/AppHeader';
import { BottomNav } from '@/src/components/shared/BottomNav';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { useLogout } from '@/src/hooks/useLogout';
import { useAuth } from '@/src/contexts/AuthContext';
import { getMembershipsHoje, marcarAusencia, desfazerAusencia } from '@/src/services/presencaService';

import { colors, spacing } from '@/src/theme';
import { LinhaCard } from './LinhaCard';

export default function HomePassageiro() {
  const { user } = useAuth();
  const { logout } = useLogout();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function carregar() {
    if (!user) return;
    try {
      const data = await getMembershipsHoje(user.id);
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { carregar(); }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar();
  }, [user]);

  async function handleAusencia(item: any) {
    Alert.alert(
      'Confirmar ausência',
      `Marcar ausência para ${item.linha.nome} às ${item.horario.hora}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar', style: 'destructive',
          onPress: async () => {
            const id = `${item.membership.id}_${item.horario.id}`;
            setLoadingId(id);
            try {
              await marcarAusencia(user!.id, item.membership.id, item.membership.linhaId, item.linha.donoId, item.horario.id, new Date());
              await carregar();
            } catch (e: any) { Alert.alert('Erro', e.message); }
            finally { setLoadingId(null); }
          }
        }
      ]
    );
  }

  async function handleDesfazer(item: any) {
    const id = `${item.membership.id}_${item.horario.id}`;
    setLoadingId(id);
    try {
      await desfazerAusencia(item.membership.id, item.horario.id, new Date());
      await carregar();
    } catch (e: any) { Alert.alert('Erro', e.message); }
    finally { setLoadingId(null); }
  }

  return (
    <View style={styles.container}>
      <AppHeader nome={user?.nome} onLogout={logout} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Buscando suas linhas...</Text>
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon="bus-outline"
          title="Nenhuma linha hoje"
          description="Você ainda não está inscrito em nenhuma linha ou não tem viagens programadas para hoje."
          actionLabel="Buscar linhas disponíveis"
          onAction={() => {}}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          <Text style={styles.sectionLabel}>Suas viagens de hoje</Text>
          {items.map((item, i) => (
            <LinhaCard
              key={`${item.membership.id}_${item.horario.id}_${i}`}
              item={item}
              onAusencia={() => handleAusencia(item)}
              onDesfazer={() => handleDesfazer(item)}
              loadingId={loadingId}
            />
          ))}
        </ScrollView>
      )}

      <BottomNav role="passageiro" active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.textSecondary },
  scroll: { padding: spacing.lg, gap: spacing.md },
  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
});