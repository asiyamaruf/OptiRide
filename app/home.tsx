import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAppStore } from '../store/app.store';
import { useAuthStore } from '../store/auth.store';

export default function HomeScreen() {
  const router = useRouter();
  const setRole = useAppStore((s) => s.setRole);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  const go = (role: 'passenger' | 'grocery' | 'driver') => {
    setRole(role);
    if (role === 'passenger') router.push('/passenger/home');
    if (role === 'grocery') router.push('/grocery/home');
    if (role === 'driver') router.push('/driver/tasks');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your path</Text>
      <Text style={styles.subtitle}>{profile?.name ? `Welcome, ${profile.name}` : 'Select a role to continue'}</Text>
      <Pressable style={styles.card} onPress={() => go('passenger')}>
        <Text style={styles.cardTitle}>Passenger</Text>
        <Text style={styles.cardText}>Request rides, see routes, track your driver.</Text>
      </Pressable>
      <Pressable style={styles.card} onPress={() => go('grocery')}>
        <Text style={styles.cardTitle}>Grocery</Text>
        <Text style={styles.cardText}>Shop essentials, set delivery pin, get fastest drop.</Text>
      </Pressable>
      <Pressable style={styles.card} onPress={() => go('driver')}>
        <Text style={styles.cardTitle}>Driver</Text>
        <Text style={styles.cardText}>See assigned tasks and optimized routes.</Text>
      </Pressable>
      <Pressable style={[styles.card, styles.logout]} onPress={signOut}>
        <Text style={[styles.cardTitle, styles.logoutText]}>Logout</Text>
        <Text style={[styles.cardText, styles.logoutText]}>Clear session and switch accounts.</Text>
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
    color: '#111827',
    marginBottom: 4
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  logout: {
    backgroundColor: '#0f172a'
  },
  logoutText: {
    color: '#e2e8f0'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6
  },
  cardText: {
    color: '#4b5563'
  }
});
