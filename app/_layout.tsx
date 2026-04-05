import { Stack } from 'expo-router';
import { AuthProvider } from '@/src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(passageiro)" />
        <Stack.Screen name="(motorista)" />
        <Stack.Screen name="(dono)" />
      </Stack>
    </AuthProvider>
  );
}