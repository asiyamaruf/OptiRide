import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useAppStore } from '../../store/app.store';
import { haversineDistanceKm, formatKm } from '../../utils/distance';

export default function PassengerHome() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const ride = useAppStore((s) => s.ride);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger</Text>
      <Text style={styles.subtitle}>{profile?.name ? `Hi ${profile.name}` : 'Ready to ride?'}</Text>
      <Pressable style={styles.card} onPress={() => router.push('/passenger/ride')}>
        <Text style={styles.cardTitle}>Book a ride</Text>
        <Text style={styles.cardText}>Set pickup and drop on the map and we will assign the nearest driver.</Text>
      </Pressable>
      {ride && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Last ride</Text>
          <Text style={styles.cardText}>Status: {ride.status}</Text>
          <Text style={styles.cardText}>
            Route:{' '}
            {formatKm(
              haversineDistanceKm(
                { lat: ride.pickup_lat, lng: ride.pickup_lng },
                { lat: ride.drop_lat, lng: ride.drop_lng }
              )
            )}
          </Text>
          <Pressable style={styles.button} onPress={() => router.push('/passenger/success')}>
            <Text style={styles.buttonText}>View details</Text>
          </Pressable>
        </View>
      )}
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
    marginBottom: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6
  },
  cardText: {
    color: '#4b5563',
    marginBottom: 6
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  }
});

