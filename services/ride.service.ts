import { supabase, Driver, Ride, RideStatus } from '../lib/supabase';
import { generateId } from '../utils/uuid';
import { chooseNearestDriver } from './route.service';

interface RequestRideInput {
  userId: string;
  pickup: { lat: number; lng: number };
  drop: { lat: number; lng: number };
}

class RideService {
  async getAvailableDrivers(): Promise<Driver[]> {
    const { data, error } = await supabase.from('drivers').select('*').eq('is_available', true);
    if (error) throw error;
    return data || [];
  }

  async requestRide(input: RequestRideInput) {
    const drivers = await this.getAvailableDrivers();
    const driver = chooseNearestDriver(input.pickup, drivers);
    const rideId = generateId();

    const { error: rideError } = await supabase.from('rides').insert({
      id: rideId,
      user_id: input.userId,
      pickup_lat: input.pickup.lat,
      pickup_lng: input.pickup.lng,
      drop_lat: input.drop.lat,
      drop_lng: input.drop.lng,
      status: driver ? 'ASSIGNED' : 'REQUESTED',
      driver_id: driver?.id ?? null
    });
    if (rideError) throw rideError;

    if (driver) {
      const { error: taskError } = await supabase.from('tasks').insert({
        id: generateId(),
        driver_id: driver.id,
        type: 'ride',
        ref_id: rideId,
        status: 'ASSIGNED',
        sequence: 0
      });
      if (taskError) throw taskError;

      await supabase.from('drivers').update({ is_available: false }).eq('id', driver.id);
    }

    return { rideId, driver };
  }

  async updateRideStatus(rideId: string, status: RideStatus) {
    const { error } = await supabase.from('rides').update({ status }).eq('id', rideId);
    if (error) throw error;
  }

  async getRide(rideId: string): Promise<Ride | null> {
    const { data, error } = await supabase.from('rides').select('*').eq('id', rideId).maybeSingle();
    if (error) throw error;
    return data;
  }

  async listUserRides(userId: string): Promise<Ride[]> {
    const { data, error } = await supabase.from('rides').select('*').eq('user_id', userId).order('id', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}

export const rideService = new RideService();
