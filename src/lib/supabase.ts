import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use a no-op lock instead of navigator.locks to prevent AbortError
        // from lock contention. Safe for single-tab applications.
        lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
            return await fn()
        },
    },
})
