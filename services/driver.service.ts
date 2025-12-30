import { supabase, Task, TaskStatus, TaskType } from '../lib/supabase';
import { generateId } from '../utils/uuid';
import { rideService } from './ride.service';
import { groceryService } from './grocery.service';

class DriverService {
  async fetchTasks(driverId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('driver_id', driverId)
      .order('sequence', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const { data, error } = await supabase.from('tasks').update({ status }).eq('id', taskId).select('type,ref_id,driver_id').maybeSingle();
    if (error) throw error;

    if (!data) return;
    if (data.type === 'ride' && status === 'IN_PROGRESS') {
      await rideService.updateRideStatus(data.ref_id, 'IN_PROGRESS');
    }
    if (data.type === 'order' && status === 'IN_PROGRESS') {
      await groceryService.updateOrderStatus(data.ref_id, 'IN_PROGRESS');
    }
  }

  async completeTask(taskId: string, driverId: string) {
    const { data, error } = await supabase.from('tasks').update({ status: 'COMPLETED' }).eq('id', taskId).select('type,ref_id').maybeSingle();
    if (error) throw error;

    if (data?.type === 'ride') {
      await rideService.updateRideStatus(data.ref_id, 'COMPLETED');
    }
    if (data?.type === 'order') {
      await groceryService.updateOrderStatus(data.ref_id, 'DELIVERED');
    }

    const tasks = await this.fetchTasks(driverId);
    const hasOpen = tasks.some((t) => t.status !== 'COMPLETED');
    if (!hasOpen) {
      await supabase.from('drivers').update({ is_available: true }).eq('id', driverId);
    }
  }

  async addTask(driverId: string, type: TaskType, refId: string, sequence = 0) {
    const { error } = await supabase.from('tasks').insert({
      id: generateId(),
      driver_id: driverId,
      type,
      ref_id: refId,
      status: 'ASSIGNED',
      sequence
    });
    if (error) throw error;
  }
}

export const driverService = new DriverService();
