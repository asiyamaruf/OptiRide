import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { useAppStore } from '../../store/app.store';
import { driverService } from '../../services/driver.service';

export default function DriverTasks() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const { setDriverTasks, driverTasks } = useAppStore();
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const tasks = await driverService.fetchTasks(profile.id);
      setDriverTasks(tasks);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [profile?.id]);

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Login required</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/driver/login')}>
          <Text style={styles.buttonText}>Go to login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned tasks</Text>
      <FlatList
        data={driverTasks}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push({ pathname: '/driver/details', params: { id: item.id } })}>
            <Text style={styles.cardTitle}>
              {item.type.toUpperCase()} • {item.status}
            </Text>
            <Text style={styles.cardText}>Ref: {item.ref_id}</Text>
            <Text style={styles.cardText}>Sequence: {item.sequence}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            {loading ? (
              <ActivityIndicator color="#4A90E2" />
            ) : (
              <Text style={styles.cardText}>No tasks assigned</Text>
            )}
          </View>
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', padding: 16, paddingBottom: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardText: { color: '#4b5563' },
  empty: { padding: 24, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  button: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: { color: '#fff', fontWeight: '700' }
});



