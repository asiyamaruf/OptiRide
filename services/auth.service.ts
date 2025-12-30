import { supabase, UserProfile, UserRole } from '../lib/supabase';

interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

class AuthService {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    const profile = data.user?.id ? await this.fetchProfile(data.user.id) : null;
    return { session: data.session, profile };
  }

  async signUp(payload: SignUpPayload) {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error('Unable to create user profile');

    const { error: profileError } = await supabase.from('users').upsert({
      id: userId,
      name: payload.name,
      phone: payload.phone,
      role: payload.role
    });
    if (profileError) throw profileError;

    if (payload.role === 'driver') {
      await supabase.from('drivers').upsert({
        id: userId,
        name: payload.name,
        is_available: true,
        lat: 0,
        lng: 0
      });
    }

    return data;
  }

  async fetchProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id,name,phone,role')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}

export const authService = new AuthService();