import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/(auth)/login');
      return;
    }

    if (user.roles.includes('dono')) {
      router.replace('/(dono)/home');
    } else if (user.roles.includes('motorista')) {
      router.replace('/(motorista)/home');
    } else {
      router.replace('/(passageiro)/home');
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#1A3C6E" />
    </View>
  );
}