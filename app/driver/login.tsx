import { useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useAppStore } from '../../store/app.store';

export default function DriverLogin() {
  const router = useRouter();
  const { signIn, loading } = useAuthStore();
  const setRole = useAppStore((s) => s.setRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email.trim(), password);
      const profile = useAuthStore.getState().profile;
      if (profile?.role !== 'driver') {
        Alert.alert('Not a driver', 'Use passenger/grocery login instead.');
        return;
      }
      setRole('driver');
      router.replace('/driver/tasks');
    } catch (err: any) {
      Alert.alert('Login failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </Pressable>
      <Link href="/" style={styles.link}>
        Back to user login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f7f9fc' },
  title: { fontSize: 28, fontWeight: '700', color: '#4A90E2', marginBottom: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { marginTop: 12, color: '#2563eb', fontWeight: '600' }
});



