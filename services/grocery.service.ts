import { supabase, Driver, Order, OrderStatus } from '../lib/supabase';
import { generateId } from '../utils/uuid';
import { chooseNearestDriver } from './route.service';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PlaceOrderInput {
  userId: string;
  items: CartItem[];
  address: string;
  coordinates: { lat: number; lng: number };
}

class GroceryService {
  async getAvailableDrivers(): Promise<Driver[]> {
    const { data, error } = await supabase.from('drivers').select('*').eq('is_available', true);
    if (error) throw error;
    return data || [];
  }

  async placeOrder(input: PlaceOrderInput) {
    const drivers = await this.getAvailableDrivers();
    const driver = chooseNearestDriver(input.coordinates, drivers);
    const orderId = generateId();

    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      user_id: input.userId,
      items: input.items,
      address: input.address,
      lat: input.coordinates.lat,
      lng: input.coordinates.lng,
      status: driver ? 'ASSIGNED' : 'CREATED',
      driver_id: driver?.id ?? null
    });
    if (orderError) throw orderError;

    if (driver) {
      const { error: taskError } = await supabase.from('tasks').insert({
        id: generateId(),
        driver_id: driver.id,
        type: 'order',
        ref_id: orderId,
        status: 'ASSIGNED',
        sequence: 0
      });
      if (taskError) throw taskError;

      await supabase.from('drivers').update({ is_available: false }).eq('id', driver.id);
    }

    return { orderId, driver };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle();
    if (error) throw error;
    return data;
  }
}

export const groceryService = new GroceryService();
