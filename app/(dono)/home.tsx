import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { signOut } from '@/src/services/authService';
import { useAuth } from '@/src/contexts/AuthContext';

function getNomeHora(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getDataFormatada(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// --- Barra de ocupação ---
function OcupacaoBar({ atual, total }: { atual: number; total: number }) {
  const pct = total > 0 ? atual / total : 0;
  const color = pct >= 0.8 ? '#E24B4A' : pct >= 0.6 ? '#F59E0B' : '#1D9E75';
  return (
    <View style={styles.barWrap}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barLabel, { color }]}>{atual}/{total}</Text>
    </View>
  );
}

// --- Badge de van ---
function VanBadge({ atual, total }: { atual: number; total: number }) {
  const pct = total > 0 ? atual / total : 0;
  const need2 = pct > 0.8;
  return (
    <View style={[styles.vanBadge, { backgroundColor: need2 ? '#FAEEDA' : '#E1F5EE' }]}>
      <Ionicons name="bus-outline" size={12} color={need2 ? '#854F0B' : '#085041'} />
      <Text style={[styles.vanBadgeText, { color: need2 ? '#854F0B' : '#085041' }]}>
        {need2 ? '2 vans' : '1 van'}
      </Text>
    </View>
  );
}

// --- Card de linha ---
function LinhaCard({ linha }: { linha: any }) {
  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    andamento: { label: 'Em andamento', color: '#085041', bg: '#E1F5EE' },
    aguardando: { label: 'Aguardando',   color: '#633806', bg: '#FAEEDA' },
    concluido:  { label: 'Concluído',    color: '#5F5E5A', bg: '#F1EFE8' },
  };
  const s = statusMap[linha.statusHoje ?? 'aguardando'];

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.linhaNome}>{linha.nome}</Text>
          <Text style={styles.linhaInfo}>
            {linha.placa ?? '—'}  ·  {linha.motoristaNome ?? 'Sem motorista'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
          <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>

      <OcupacaoBar atual={linha.confirmados ?? 0} total={linha.capacidade ?? 20} />

      <View style={styles.cardBottom}>
        <VanBadge atual={linha.confirmados ?? 0} total={linha.capacidade ?? 20} />
        {(linha.confirmados / linha.capacidade) >= 0.8 && (
          <View style={styles.alertPill}>
            <Ionicons name="warning-outline" size={12} color="#854F0B" />
            <Text style={styles.alertPillText}>Ocupação alta</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// --- Tela principal ---
export default function HomeDono() {
  const { user } = useAuth();
  const router = useRouter();
  const [linhas, setLinhas] = useState<any[]>([]);
  const [vans, setVans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function carregar() {
    if (!user) return;
    try {
      // Busca vans do dono
      const vansSnap = await getDocs(
        query(collection(db, 'vans'), where('donoId', '==', user.id))
      );
      setVans(vansSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Busca linhas do dono
      const linhasSnap = await getDocs(
        query(collection(db, 'linhas'),
          where('donoId', '==', user.id),
          where('ativa', '==', true))
      );
      setLinhas(linhasSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Erro ao carregar dashboard:', e);
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

  async function handleLogout() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        }
      }
    ]);
  }

  const linhasAlerta = linhas.filter(l =>
    l.capacidade > 0 && (l.confirmados / l.capacidade) >= 0.8
  );

  const TopBar = () => (
    <View style={styles.topBar}>
      <View style={{ gap: 2 }}>
        <Text style={styles.greeting}>
          {getNomeHora()}{user?.nome ? `, ${user.nome.split(' ')[0]}` : ''}
        </Text>
        <Text style={styles.dataText}>{capitalize(getDataFormatada())}</Text>
      </View>
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color="#1A1A2E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#E24B4A" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#1A3C6E" />
          <Text style={styles.loadingText}>Carregando sua frota...</Text>
        </View>
        <BottomNav active="home" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A3C6E" />
        }
      >
        {/* Strip resumo */}
        <View style={styles.stripRow}>
          <View style={styles.stripItem}>
            <Text style={styles.stripNum}>{vans.length}</Text>
            <Text style={styles.stripLabel}>vans</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripNum}>{linhas.length}</Text>
            <Text style={styles.stripLabel}>linhas</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripNum}>
              {linhas.filter(l => l.statusHoje === 'andamento').length}
            </Text>
            <Text style={styles.stripLabel}>ativas hoje</Text>
          </View>
        </View>

        {/* Alertas */}
        {linhasAlerta.length > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning-outline" size={18} color="#854F0B" />
            <Text style={styles.alertText}>
              {linhasAlerta.length === 1
                ? `${linhasAlerta[0].nome} com ocupação alta`
                : `${linhasAlerta.length} linhas com ocupação alta`
              }
            </Text>
          </View>
        )}

        {/* Linhas de hoje */}
        {linhas.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Linhas em operação</Text>
            {linhas.map(l => <LinhaCard key={l.id} linha={l} />)}
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bus-outline" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma linha cadastrada</Text>
            <Text style={styles.emptyDesc}>
              Crie sua primeira van e linha para começar a gerenciar seus passageiros.
            </Text>
            <TouchableOpacity
              style={styles.btnCriar}
              onPress={() => router.push('/(dono)/criar-linha')}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.btnCriarText}>Criar primeira linha</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* FAB — criar linha */}
      {linhas.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/(dono)/criar-linha')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <BottomNav active="home" />
    </View>
  );
}

// --- Bottom Nav ---
function BottomNav({ active }: { active: string }) {
  const router = useRouter();
  const tabs = [
    { id: 'home',      icon: 'home',        label: 'Início',    route: '/(dono)/home' },
    { id: 'frota',     icon: 'bus',         label: 'Frota',     route: '/(dono)/frota' },
    { id: 'linhas',    icon: 'map',         label: 'Linhas',    route: '/(dono)/linhas' },
    { id: 'chat',      icon: 'chatbubble-ellipses', label: 'Chat', route: '/(dono)/chat' },
    { id: 'relatorios',icon: 'bar-chart',   label: 'Relatórios',route: '/(dono)/relatorios' },
  ] as const;

  return (
    <View style={styles.bottomNav}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={styles.navItem}
          onPress={() => router.push(tab.route as any)}
        >
          <Ionicons
            name={active === tab.id ? tab.icon : `${tab.icon}-outline` as any}
            size={22}
            color={active === tab.id ? '#1A3C6E' : '#9CA3AF'}
          />
          <Text style={[styles.navLabel, active === tab.id && styles.navLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F1F1'
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  dataText: { fontSize: 13, color: '#6B7280' },
  topActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center'
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },

  stripRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'space-around'
  },
  stripItem: { alignItems: 'center', gap: 2 },
  stripNum: { fontSize: 24, fontWeight: '800', color: '#1A3C6E' },
  stripLabel: { fontSize: 12, color: '#6B7280' },
  stripDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },

  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FAEEDA', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#FAC775'
  },
  alertText: { flex: 1, fontSize: 13, color: '#854F0B', fontWeight: '500' },

  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: 0.5
  },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  linhaNome: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  linhaInfo: { fontSize: 12, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },

  barWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barBg: {
    flex: 1, height: 6, backgroundColor: '#F1EFE8',
    borderRadius: 3, overflow: 'hidden'
  },
  barFill: { height: '100%', borderRadius: 3 },
  barLabel: { fontSize: 13, fontWeight: '700', minWidth: 36, textAlign: 'right' },

  cardBottom: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  vanBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20
  },
  vanBadgeText: { fontSize: 12, fontWeight: '600' },
  alertPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FAEEDA', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20
  },
  alertPillText: { fontSize: 11, color: '#854F0B', fontWeight: '500' },

  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6B7280' },

  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 40, gap: 16, paddingTop: 60
  },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#F1EFE8', justifyContent: 'center', alignItems: 'center'
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  btnCriar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F4821F', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24, marginTop: 8
  },
  btnCriarText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  fab: {
    position: 'absolute', right: 20, bottom: 90,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#F4821F', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#F4821F', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6
  },

  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#F1F1F1',
    paddingBottom: 20, paddingTop: 10
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, color: '#9CA3AF' },
  navLabelActive: { color: '#1A3C6E', fontWeight: '600' },
});