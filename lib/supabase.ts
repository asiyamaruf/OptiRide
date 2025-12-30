import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.supabaseUrl;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export type UserRole = 'passenger' | 'grocery' | 'driver';
export type RideStatus = 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
export type OrderStatus = 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'DELIVERED';
export type TaskStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskType = 'ride' | 'order';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface Driver {
  id: string;
  name: string;
  is_available: boolean;
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  user_id: string;
  pickup_lat: number;
  pickup_lng: number;
  drop_lat: number;
  drop_lng: number;
  status: RideStatus;
  driver_id?: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  address: string;
  lat: number;
  lng: number;
  status: OrderStatus;
  driver_id?: string | null;
}

export interface Task {
  id: string;
  driver_id: string;
  type: TaskType;
  ref_id: string;
  status: TaskStatus;
  sequence: number;
}
