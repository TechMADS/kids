import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

function missingEnvError() {
  throw new Error('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
}

/**
 * Lazily return a public client for browser use. This avoids crashing the dev server
 * when env vars are not set during local work.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) missingEnvError()
  return createClient(supabaseUrl!, supabaseAnonKey!)
}

/**
 * Server client factory. Prefer providing SUPABASE_SERVICE_ROLE_KEY in production
 */
export function supabaseServer(serviceKey?: string) {
  const key = serviceKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey
  if (!supabaseUrl || !key) missingEnvError()
  return createClient(supabaseUrl!, key!)
}

// For backward compatibility, export a `supabase` that warns when used without setup
export const supabase = {
  _get() {
    return getSupabaseClient()
  },
} as unknown as SupabaseClient
