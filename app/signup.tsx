import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../store/auth.store';

type RoleOption = 'passenger' | 'grocery' | 'driver';

const roles: { label: string; value: RoleOption }[] = [
  { label: 'Passenger', value: 'passenger' },
  { label: 'Grocery Customer', value: 'grocery' },
  { label: 'Driver', value: 'driver' }
];

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleOption>('passenger');

  const handleSignup = async () => {
    try {
      await signUp(email.trim(), password, name.trim(), phone.trim(), role);
      Alert.alert('Account created', 'You can now login.');
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Signup failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" style={styles.input} />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
      <View style={styles.roleRow}>
        {roles.map((r) => (
          <Pressable key={r.value} style={[styles.chip, role === r.value && styles.chipActive]} onPress={() => setRole(r.value)}>
            <Text style={[styles.chipText, role === r.value && styles.chipTextActive]}>{r.label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f9fc'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 16
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
  chipActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2'
  },
  chipText: {
    color: '#374151',
    fontWeight: '600'
  },
  chipTextActive: {
    color: '#fff'
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});
