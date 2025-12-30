import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/auth.store';

export default function RootLayout() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f7f9fc' }
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Create Account' }} />
        <Stack.Screen name="home" options={{ title: 'Choose Experience' }} />
        <Stack.Screen name="passenger/home" options={{ title: 'Passenger' }} />
        <Stack.Screen name="passenger/ride" options={{ title: 'Book Ride' }} />
        <Stack.Screen name="passenger/success" options={{ title: 'Ride Confirmed' }} />
        <Stack.Screen name="grocery/home" options={{ title: 'Groceries' }} />
        <Stack.Screen name="grocery/products" options={{ title: 'Products' }} />
        <Stack.Screen name="grocery/address" options={{ title: 'Delivery Address' }} />
        <Stack.Screen name="driver/login" options={{ title: 'Driver Login' }} />
        <Stack.Screen name="driver/tasks" options={{ title: 'Driver Tasks' }} />
        <Stack.Screen name="driver/details" options={{ title: 'Task Details' }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
