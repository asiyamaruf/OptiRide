import { create } from 'zustand';
import { Driver, Ride, Order, Task } from '../lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AppState {
  selectedRole: 'passenger' | 'grocery' | 'driver' | null;
  ride?: Ride | null;
  order?: Order | null;
  cart: CartItem[];
  driverTasks: Task[];
  setRole: (role: AppState['selectedRole']) => void;
  setRide: (ride: Ride | null) => void;
  setOrder: (order: Order | null) => void;
  setCart: (items: CartItem[]) => void;
  setDriverTasks: (tasks: Task[]) => void;
  clear: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedRole: null,
  ride: null,
  order: null,
  cart: [],
  driverTasks: [],
  setRole: (role) => set({ selectedRole: role }),
  setRide: (ride) => set({ ride }),
  setOrder: (order) => set({ order }),
  setCart: (items) => set({ cart: items }),
  setDriverTasks: (tasks) => set({ driverTasks: tasks }),
  clear: () => set({ selectedRole: null, ride: null, order: null, cart: [], driverTasks: [] })
}));



