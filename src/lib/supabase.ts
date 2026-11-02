/**
 * RescuePlate Supabase Client Configuration
 *
 * Provides production integration with Supabase Postgres DB & Auth when credentials exist.
 * Automatically and transparently falls back to the in-memory/localStorage dataService
 * in local Hackathon Demo Mode so judges can run the app without external account configuration.
 */

interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env?.VITE_SUPABASE_URL;
  const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  const isConfigured = Boolean(url && anonKey && !url.includes('placeholder'));

  return { url, anonKey, isConfigured };
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

