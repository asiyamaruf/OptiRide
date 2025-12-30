import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { authService } from '../services/auth.service';
import { supabase, UserProfile, UserRole } from '../lib/supabase';
import { useAppStore } from './app.store';

interface AuthState {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error?: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  loading: false,
  error: null,
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { session, profile } = await authService.signIn(email, password);
      set({ session: session ?? null, profile: profile ?? null });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password, name, phone, role) => {
    set({ loading: true, error: null });
    try {
      await authService.signUp({ email, password, name, phone, role });
      const { data } = await supabase.auth.signInWithPassword({ email, password });
      if (data.session?.user?.id) {
        const profile = await authService.fetchProfile(data.session.user.id);
        set({ session: data.session, profile: profile ?? null });
      }
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    await authService.signOut();
    useAppStore.getState().clear();
    set({ session: null, profile: null });
  },
  bootstrap: async () => {
    set({ loading: true });
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (session?.user?.id) {
      const profile = await authService.fetchProfile(session.user.id);
      set({ session, profile: profile ?? null });
    } else {
      set({ session: null, profile: null });
    }
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession?.user?.id) {
        const profile = await authService.fetchProfile(newSession.user.id);
        set({ session: newSession, profile: profile ?? null });
      } else {
        set({ session: null, profile: null });
      }
    });
    set({ loading: false });
  }
}));
