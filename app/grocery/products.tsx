import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/app.store';

const products = [
  { id: 'milk', name: 'Organic Milk', price: 3.5 },
  { id: 'bread', name: 'Sourdough Bread', price: 4.25 },
  { id: 'eggs', name: 'Free-range Eggs', price: 5.1 },
  { id: 'fruits', name: 'Seasonal Fruits', price: 6.75 },
  { id: 'veggies', name: 'Fresh Veggies Pack', price: 7.2 }
];

export default function ProductsScreen() {
  const router = useRouter();
  const cart = useAppStore((s) => s.cart);
  const setCart = useAppStore((s) => s.setCart);
  const [selection, setSelection] = useState<Record<string, number>>(
    Object.fromEntries(cart.map((item) => [item.id, item.quantity]))
  );

  const toggleQuantity = (id: string, delta: number) => {
    setSelection((prev) => {
      const next = { ...prev };
      const updated = Math.max(0, (prev[id] ?? 0) + delta);
      if (updated === 0) delete next[id];
      else next[id] = updated;
      return next;
    });
  };

  const cartItems = useMemo(
    () =>
      Object.entries(selection).map(([id, qty]) => {
        const product = products.find((p) => p.id === id)!;
        return { ...product, quantity: qty };
      }),
    [selection]
  );

  const persistCart = () => {
    setCart(cartItems);
    router.back();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const qty = selection[item.id] ?? 0;
          return (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.qtyRow}>
                <Pressable style={styles.qtyButton} onPress={() => toggleQuantity(item.id, -1)}>
                  <Text style={styles.qtyText}>-</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{qty}</Text>
                <Pressable style={styles.qtyButton} onPress={() => toggleQuantity(item.id, 1)}>
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>
          Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
        </Text>
        <Pressable style={styles.button} onPress={persistCart}>
          <Text style={styles.buttonText}>Save cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  price: { color: '#4b5563', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  qtyValue: { fontSize: 16, fontWeight: '700', color: '#111827' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff'
  },
  total: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: '700' }
});




