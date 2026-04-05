import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signIn, getUserProfile } from "@/src/services/authService";
import { AuthInput } from "@/src/components/shared/AuthInput";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha e-mail e senha para continuar.",
      );
      return;
    }
    setLoading(true);
    try {
      const firebaseUser = await signIn(email.trim(), senha);
      const profile = await getUserProfile(firebaseUser.uid);
      if (!profile) throw new Error("Perfil não encontrado. Tente novamente.");

      if (profile.roles.includes("dono")) router.replace("/(dono)/home");
      else if (profile.roles.includes("motorista"))
        router.replace("/(motorista)/home");
      else router.replace("/(passageiro)/home");
    } catch (e: any) {
      const msg =
        e.code === "auth/invalid-credential"
          ? "E-mail ou senha incorretos."
          : e.message;
      Alert.alert("Erro ao entrar", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}>
            <Ionicons name="bus" size={32} color="#fff" />
          </View>
          <Text style={styles.logoText}>FastVan</Text>
          <Text style={styles.logoSub}>
            Acesse sua conta para gerenciar rotas
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
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
            placeholder="Sua senha"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {/* Botão entrar */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.btnRow}>
              <Text style={styles.btnText}>Entrar</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Cadastro */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Não tem conta?</Text>
          <Link href="/(auth)/cadastro-role" asChild>
            <TouchableOpacity>
              <Text style={styles.registerLink}> Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.footer}>© 2024 FastVan Logística S.A.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    gap: 24,
  },
  logoArea: { alignItems: "center", gap: 10 },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#F4821F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  logoText: { fontSize: 28, fontWeight: "700", color: "#1A1A2E" },
  logoSub: { fontSize: 13, color: "#6B7280", textAlign: "center" },
  form: { gap: 14 },
  forgotBtn: { alignSelf: "flex-end" },
  forgotText: { fontSize: 13, color: "#1A3C6E", fontWeight: "500" },
  btnPrimary: {
    backgroundColor: "#F4821F",
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#F4821F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: { fontSize: 14, color: "#6B7280" },
  registerLink: { fontSize: 14, color: "#1A3C6E", fontWeight: "700" },
  footer: { textAlign: "center", fontSize: 12, color: "#D1D5DB", marginTop: 8 },
});
