import MapView, { Marker, Polyline } from 'react-native-maps';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/app.store';
import { formatMinutes, estimateDurationMinutes } from '../../utils/time';
import { haversineDistanceKm } from '../../utils/distance';

export default function RideSuccess() {
  const router = useRouter();
  const ride = useAppStore((s) => s.ride);

  if (!ride) {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>No ride selected</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/passenger/ride')}>
          <Text style={styles.buttonText}>Book a ride</Text>
        </Pressable>
      </View>
    );
  }

  const pickup = { latitude: ride.pickup_lat, longitude: ride.pickup_lng };
  const drop = { latitude: ride.drop_lat, longitude: ride.drop_lng };
  const distance = haversineDistanceKm(
    { lat: ride.pickup_lat, lng: ride.pickup_lng },
    { lat: ride.drop_lat, lng: ride.drop_lng }
  );
  const eta = formatMinutes(estimateDurationMinutes(distance));

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
      >
        <Marker coordinate={pickup} title="Pickup" pinColor="#4A90E2" />
        <Marker coordinate={drop} title="Drop" pinColor="#10b981" />
        <Polyline coordinates={[pickup, drop]} strokeWidth={4} strokeColor="#4A90E2" />
      </MapView>
      <View style={styles.card}>
        <Text style={styles.title}>Ride confirmed</Text>
        <Text style={styles.text}>Status: {ride.status}</Text>
        {ride.driver_id && <Text style={styles.text}>Driver ID: {ride.driver_id}</Text>}
        <Text style={styles.text}>Distance: {distance.toFixed(2)} km</Text>
        <Text style={styles.text}>ETA: {eta}</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/home')}>
          <Text style={styles.buttonText}>Back to home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  map: { flex: 1 },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6
  },
  text: {
    color: '#4b5563',
    marginBottom: 4
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f7f9fc'
  }
});



