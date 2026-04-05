import { useState } from 'react';
import {
  View, TextInput, TouchableOpacity,
  StyleSheet, TextInputProps, Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function AuthInput({ label, icon, isPassword, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={18} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F6FA', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: '#E5E7EB', gap: 10
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A2E' },
  icon: { },
});