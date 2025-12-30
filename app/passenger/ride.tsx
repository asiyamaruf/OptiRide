import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { rideService } from '../../services/ride.service';
import { useAuthStore } from '../../store/auth.store';
import { useAppStore } from '../../store/app.store';
import { haversineDistanceKm } from '../../utils/distance';
import { estimateDurationMinutes, formatMinutes } from '../../utils/time';

const initialRegion: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04
};

export default function RideScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const setRide = useAppStore((s) => s.setRide);
  const [pickup, setPickup] = useState<{ lat: number; lng: number } | null>(null);
  const [drop, setDrop] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const polyline = useMemo(() => {
    if (!pickup || !drop) return [];
    return [
      { latitude: pickup.lat, longitude: pickup.lng },
      { latitude: drop.lat, longitude: drop.lng }
    ];
  }, [pickup, drop]);

  const distanceKm = useMemo(() => {
    if (!pickup || !drop) return 0;
    return haversineDistanceKm(pickup, drop);
  }, [pickup, drop]);

  const etaMinutes = estimateDurationMinutes(distanceKm);

  const onMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (!pickup) {
      setPickup({ lat: latitude, lng: longitude });
      return;
    }
    setDrop({ lat: latitude, lng: longitude });
  };

  useEffect(() => {
    // reset drop if pickup removed
    if (!pickup) setDrop(null);
  }, [pickup]);

  const requestRide = async () => {
    if (!profile?.id) {
      Alert.alert('Not logged in', 'Please login to request a ride');
      return;
    }
    if (!pickup || !drop) {
      Alert.alert('Select locations', 'Tap the map to set pickup, then drop-off.');
      return;
    }
    setLoading(true);
    try {
      const { rideId, driver } = await rideService.requestRide({
        userId: profile.id,
        pickup,
        drop
      });
      const ride = await rideService.getRide(rideId);
      setRide(ride);
      router.replace('/passenger/success');
      if (driver) {
        Alert.alert('Driver assigned', driver.name);
      } else {
        Alert.alert('Ride created', 'Waiting for driver assignment');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} onPress={onMapPress}>
        {pickup && (
          <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} pinColor="#4A90E2" title="Pickup" />
        )}
        {drop && <Marker coordinate={{ latitude: drop.lat, longitude: drop.lng }} pinColor="#10b981" title="Drop" />}
        {polyline.length > 0 && <Polyline coordinates={polyline} strokeWidth={4} strokeColor="#4A90E2" />}
      </MapView>
      <View style={styles.sheet}>
        <Text style={styles.heading}>Plan your ride</Text>
        <Text style={styles.meta}>
          {pickup ? 'Pickup set' : 'Tap map for pickup'} • {drop ? 'Drop set' : 'Tap again for drop'}
        </Text>
        <View style={styles.row}>
          <Text style={styles.value}>Distance</Text>
          <Text style={styles.valueBold}>{distanceKm ? `${distanceKm.toFixed(2)} km` : '--'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>ETA</Text>
          <Text style={styles.valueBold}>{distanceKm ? formatMinutes(etaMinutes) : '--'}</Text>
        </View>
        <Pressable style={styles.button} onPress={requestRide} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Request ride</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  map: { flex: 1 },
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827'
  },
  meta: {
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  value: { color: '#4b5563' },
  valueBold: { color: '#111827', fontWeight: '700' },
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#fff', fontWeight: '700' }
});



