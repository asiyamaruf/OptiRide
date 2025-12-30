import { useRouter, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { useAppStore } from '../store/app.store';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, profile } = useAuthStore();
  const setRole = useAppStore((s) => s.setRole);

  const routeByRole = (role?: string | null) => {
    if (role === 'driver') return router.replace('/driver/tasks');
    if (role === 'passenger') return router.replace('/passenger/home');
    if (role === 'grocery') return router.replace('/grocery/home');
    router.replace('/home');
  };

  useEffect(() => {
    if (profile?.role) {
      setRole(profile.role);
      routeByRole(profile.role);
    }
  }, [profile?.role]);

  const handleLogin = async () => {
    try {
      await signIn(email.trim(), password);
      const latestRole = useAuthStore.getState().profile?.role ?? null;
      setRole(latestRole);
      routeByRole(latestRole);
    } catch (err: any) {
      Alert.alert('Login failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OptiRide</Text>
      <Text style={styles.subtitle}>Ride + Grocery, optimized locally</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </Pressable>
      <Link href="/signup" style={styles.link}>
        Create account
      </Link>
      <Link href="/driver/login" style={styles.link}>
        Driver login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24
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
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  link: {
    marginTop: 14,
    color: '#2563eb',
    fontWeight: '600'
  }
});
