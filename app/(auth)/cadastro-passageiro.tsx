import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signUp } from '@/src/services/authService';
import { AuthInput } from '@/src/components/shared/AuthInput';

export default function CadastroPassageiro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), senha, nome.trim(), ['passageiro']);
      router.replace('/(passageiro)/home');
    } catch (e: any) {
      const msg = e.code === 'auth/email-already-in-use'
        ? 'Este e-mail já está cadastrado.'
        : e.message;
      Alert.alert('Erro ao cadastrar', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>PASSAGEIRO</Text>
          </View>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Nome completo"
            icon="person-outline"
            placeholder="Seu nome completo"
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />
          <AuthInput
            label="E-mail"
            icon="mail-outline"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <AuthInput
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Mínimo 6 caracteres"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleCadastro}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Criar conta</Text>
          }
        </TouchableOpacity>

        <Text style={styles.terms}>
          Ao criar uma conta, você concorda com nossos{' '}
          <Text style={styles.termsLink}>Termos de Serviço</Text>
          {' '}e{' '}
          <Text style={styles.termsLink}>Política de Privacidade</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: {
    flexGrow: 1, paddingHorizontal: 28,
    paddingTop: 56, paddingBottom: 40, gap: 24
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  header: { gap: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3E8', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4
  },
  roleText: { fontSize: 12, fontWeight: '700', color: '#F4821F', letterSpacing: 1 },
  form: { gap: 14 },
  btnPrimary: {
    backgroundColor: '#F4821F', borderRadius: 12,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: '#F4821F', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  terms: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 18 },
  termsLink: { color: '#1A3C6E', fontWeight: '600' }
});