import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroRole() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como você usa o{'\n'}FastVan?</Text>
      <Text style={styles.subtitle}>Escolha seu perfil para continuar</Text>

      {/* Passageiro */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(auth)/cadastro-passageiro')}
        activeOpacity={0.85}
      >
        <View style={[styles.cardIcon, { backgroundColor: '#FEF3E8' }]}>
          <Text style={styles.emoji}>🎓</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Sou passageiro</Text>
          <Text style={styles.cardDesc}>Aluno ou trabalhador que usa a van</Text>
        </View>
        <View style={styles.selectBtn}>
          <Text style={styles.selectText}>SELECIONAR PERFIL</Text>
          <Ionicons name="arrow-forward" size={14} color="#F4821F" />
        </View>
      </TouchableOpacity>

      {/* Dono */}
      <TouchableOpacity
        style={[styles.card, styles.cardDono]}
        onPress={() => router.push('/(auth)/cadastro-dono')}
        activeOpacity={0.85}
      >
        <View style={[styles.cardIcon, { backgroundColor: '#EBF0F8' }]}>
          <Text style={styles.emoji}>🚐</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Sou dono de van</Text>
          <Text style={styles.cardDesc}>Gerencio linhas e motoristas</Text>
        </View>
        <View style={[styles.selectBtn, styles.selectBtnBlue]}>
          <Text style={[styles.selectText, { color: '#1A3C6E' }]}>SELECIONAR PERFIL</Text>
          <Ionicons name="arrow-forward" size={14} color="#1A3C6E" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={16} color="#6B7280" />
        <Text style={styles.backText}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff',
    paddingHorizontal: 28, paddingTop: 80,
    paddingBottom: 40, gap: 16
  },
  title: {
    fontSize: 28, fontWeight: '700',
    color: '#1A1A2E', textAlign: 'center', lineHeight: 36
  },
  subtitle: {
    fontSize: 14, color: '#6B7280',
    textAlign: 'center', marginBottom: 8
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, gap: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2
  },
  cardDono: { borderColor: '#1A3C6E', borderWidth: 1.5 },
  cardIcon: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center'
  },
  emoji: { fontSize: 26 },
  cardContent: { gap: 4 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  cardDesc: { fontSize: 13, color: '#6B7280' },
  selectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6
  },
  selectBtnBlue: {},
  selectText: { fontSize: 12, fontWeight: '700', color: '#F4821F', letterSpacing: 0.5 },
  backBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, marginTop: 8
  },
  backText: { fontSize: 14, color: '#6B7280' }
});