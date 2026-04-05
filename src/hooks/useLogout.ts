import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "@/src/services/authService";

export function useLogout() {
  const router = useRouter();

  function logout() {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  return { logout };
}
