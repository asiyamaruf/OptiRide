import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAppStore } from '../../store/app.store';
import { driverService } from '../../services/driver.service';
import { rideService } from '../../services/ride.service';
import { groceryService } from '../../services/grocery.service';
import { useAuthStore } from '../../store/auth.store';

const fallbackRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};

export default function DriverTaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const { driverTasks, setDriverTasks } = useAppStore();
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [rideDetail, setRideDetail] = useState<any>(null);
  const [orderDetail, setOrderDetail] = useState<any>(null);

  const task = driverTasks.find((t) => t.id === id);

  const loadTask = async () => {
    if (!profile?.id) return;
    const tasks = await driverService.fetchTasks(profile.id);
    setDriverTasks(tasks);
  };

  const loadDetails = async () => {
    if (!task) return;
    if (task.type === 'ride') {
      const ride = await rideService.getRide(task.ref_id);
      setRideDetail(ride);
    } else {
      const order = await groceryService.getOrder(task.ref_id);
      setOrderDetail(order);
    }
  };

  useEffect(() => {
    if (!task) {
      loadTask();
    }
  }, []);

  useEffect(() => {
    loadDetails();
  }, [task?.id]);

  const coords = useMemo(() => {
    if (rideDetail) {
      const pickup = { latitude: rideDetail.pickup_lat, longitude: rideDetail.pickup_lng };
      const drop = { latitude: rideDetail.drop_lat, longitude: rideDetail.drop_lng };
      return { markers: [pickup, drop], line: [pickup, drop] };
    }
    if (orderDetail?.lat && orderDetail?.lng) {
      const store = { latitude: fallbackRegion.latitude, longitude: fallbackRegion.longitude };
      const dest = { latitude: orderDetail.lat, longitude: orderDetail.lng };
      return { markers: [store, dest], line: [store, dest] };
    }
    return { markers: [], line: [] };
  }, [rideDetail, orderDetail]);

  const updateStatus = async (nextStatus: 'IN_PROGRESS' | 'COMPLETED') => {
    if (!task || !profile) return;
    setStatusUpdating(true);
    try {
      if (nextStatus === 'COMPLETED') {
        await driverService.completeTask(task.id, profile.id);
      } else {
        await driverService.updateTaskStatus(task.id, nextStatus);
      }
      await loadTask();
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Task not found</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/driver/tasks')}>
          <Text style={styles.buttonText}>Back to tasks</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.markers[0]?.latitude || fallbackRegion.latitude,
          longitude: coords.markers[0]?.longitude || fallbackRegion.longitude,
          latitudeDelta: fallbackRegion.latitudeDelta,
          longitudeDelta: fallbackRegion.longitudeDelta
        }}
      >
        {coords.markers.map((coord, idx) => (
          <Marker key={idx} coordinate={coord} pinColor={idx === 0 ? '#4A90E2' : '#10b981'} />
        ))}
        {coords.line.length > 1 && <Polyline coordinates={coords.line} strokeColor="#4A90E2" strokeWidth={4} />}
      </MapView>
      <View style={styles.card}>
        <Text style={styles.title}>
          {task.type.toUpperCase()} • {task.status}
        </Text>
        <Text style={styles.text}>Ref: {task.ref_id}</Text>
        {rideDetail && (
          <>
            <Text style={styles.text}>Pickup: {rideDetail.pickup_lat.toFixed(4)}, {rideDetail.pickup_lng.toFixed(4)}</Text>
            <Text style={styles.text}>Drop: {rideDetail.drop_lat.toFixed(4)}, {rideDetail.drop_lng.toFixed(4)}</Text>
          </>
        )}
        {orderDetail && (
          <>
            <Text style={styles.text}>Address: {orderDetail.address}</Text>
            <Text style={styles.text}>Location: {orderDetail.lat?.toFixed(4)}, {orderDetail.lng?.toFixed(4)}</Text>
          </>
        )}
        <View style={styles.actions}>
          {task.status === 'ASSIGNED' && (
            <Pressable style={styles.button} onPress={() => updateStatus('IN_PROGRESS')} disabled={statusUpdating}>
              {statusUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Start</Text>}
            </Pressable>
          )}
          {task.status !== 'COMPLETED' && (
            <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => updateStatus('COMPLETED')} disabled={statusUpdating}>
              {statusUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Complete</Text>}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  map: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 6 },
  text: { color: '#4b5563', marginBottom: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  button: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 10, alignItems: 'center', flex: 1 },
  buttonSecondary: { backgroundColor: '#10b981' },
  buttonText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }
});
