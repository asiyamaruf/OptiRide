import MapView, { Marker, Polyline } from 'react-native-maps';
import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { useAppStore } from '../../store/app.store';
import { groceryService } from '../../services/grocery.service';
import { haversineDistanceKm } from '../../utils/distance';
import { estimateDurationMinutes, formatMinutes } from '../../utils/time';

const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};

export default function AddressScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const cart = useAppStore((s) => s.cart);
  const setCart = useAppStore((s) => s.setCart);
  const setOrder = useAppStore((s) => s.setOrder);
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const distanceKm = useMemo(() => {
    if (!pin) return 0;
    // Assume store at initial region center
    return haversineDistanceKm({ lat: initialRegion.latitude, lng: initialRegion.longitude }, pin);
  }, [pin]);

  const eta = formatMinutes(estimateDurationMinutes(distanceKm));

  const placeOrder = async () => {
    if (!profile?.id) {
      Alert.alert('Not logged in', 'Please login first.');
      return;
    }
    if (!pin) {
      Alert.alert('Select address', 'Tap on the map to drop a delivery pin.');
      return;
    }
    if (!cart.length) {
      Alert.alert('Cart is empty', 'Add items before placing an order.');
      return;
    }
    setLoading(true);
    try {
      const { orderId, driver } = await groceryService.placeOrder({
        userId: profile.id,
        items: cart,
        address: address || 'Pinned address',
        coordinates: pin
      });
      const order = await groceryService.getOrder(orderId);
      setOrder(order);
      setCart([]);
      router.replace('/grocery/home');
      if (driver) {
        Alert.alert('Driver assigned', driver.name);
      } else {
        Alert.alert('Order placed', 'Awaiting driver assignment.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setPin({ lat: latitude, lng: longitude });
        }}
      >
        {pin && <Marker coordinate={{ latitude: pin.lat, longitude: pin.lng }} pinColor="#4A90E2" />}
        {pin && (
          <Polyline
            coordinates={[
              { latitude: initialRegion.latitude, longitude: initialRegion.longitude },
              { latitude: pin.lat, longitude: pin.lng }
            ]}
            strokeColor="#4A90E2"
            strokeWidth={4}
          />
        )}
      </MapView>
      <View style={styles.sheet}>
        <Text style={styles.title}>Delivery address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Apartment, street, notes"
          style={styles.input}
        />
        <Text style={styles.meta}>{pin ? 'Pin set' : 'Tap on map to set pin'}</Text>
        <Text style={styles.meta}>Distance: {distanceKm ? `${distanceKm.toFixed(2)} km` : '--'}</Text>
        <Text style={styles.meta}>ETA: {distanceKm ? eta : '--'}</Text>
        <Pressable style={styles.button} onPress={placeOrder} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Place order</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  map: { flex: 1 },
  sheet: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8
  },
  meta: { color: '#4b5563', marginBottom: 4 },
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#fff', fontWeight: '700' }
});

