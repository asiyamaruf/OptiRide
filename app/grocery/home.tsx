import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAppStore } from '../../store/app.store';

export default function GroceryHome() {
  const router = useRouter();
  const cart = useAppStore((s) => s.cart);
  const order = useAppStore((s) => s.order);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery</Text>
      <Text style={styles.subtitle}>Shop curated essentials</Text>
      <Pressable style={styles.card} onPress={() => router.push('/grocery/products')}>
        <Text style={styles.cardTitle}>Browse products</Text>
        <Text style={styles.cardText}>Select items and manage your cart.</Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cart summary</Text>
        <Text style={styles.cardText}>Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</Text>
        <Text style={styles.cardText}>
          Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
        </Text>
        <Pressable
          style={[styles.button, cart.length === 0 && styles.buttonDisabled]}
          onPress={() => router.push('/grocery/address')}
          disabled={cart.length === 0}
        >
          <Text style={styles.buttonText}>Choose address</Text>
        </Pressable>
      </View>
      {order && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Last order</Text>
          <Text style={styles.cardText}>Status: {order.status}</Text>
          <Text style={styles.cardText}>Destination: {order.lat.toFixed(4)}, {order.lng.toFixed(4)}</Text>
          <Text style={styles.cardText}>Items: {order.items.length}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f7f9fc' },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 6 },
  subtitle: { color: '#6b7280', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 6 },
  cardText: { color: '#4b5563', marginBottom: 4 },
  button: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700' }
});
