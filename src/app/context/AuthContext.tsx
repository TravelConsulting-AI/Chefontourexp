import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// ── Role label mapping (never expose raw enum values) ──
type DbRole = Database['public']['Enums']['user_role'];

export const ROLE_LABELS: Record<DbRole, string> = {
    superadmin: 'Owner',
    leadership: 'Team',
    reseller: 'Partner',
    supplier: 'Operator',
    traveler: 'Traveler',
};

// ── Types ──
type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextValue {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    role: DbRole | null;
    roleLabel: string | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ──
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const role = profile?.role ?? null;
    const roleLabel = role ? ROLE_LABELS[role] : null;

    // ── Fetch profile for a given user id ──
    const fetchProfile = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.warn('Could not fetch profile:', error.message);
            setProfile(null);
        } else {
            setProfile(data);
        }
    }, []);

    // ── Rehydrate session on mount + listen ──
    useEffect(() => {
        let isMounted = true;

        // Safety timeout: never stay loading for more than 5 seconds
        const safetyTimer = setTimeout(() => {
            if (isMounted) setIsLoading(false);
        }, 5000);

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session: s } }) => {
            if (!isMounted) return;
            setSession(s);
            setUser(s?.user ?? null);
            if (s?.user) {
                try {
                    await fetchProfile(s.user.id);
                } catch (err) {
                    console.warn('Initial profile fetch failed:', err);
                }
            }
            if (isMounted) setIsLoading(false);
        }).catch(() => {
            if (isMounted) setIsLoading(false);
        });

        // Listen for auth changes – MUST NOT be async to avoid blocking
        // Supabase JS waits for onAuthStateChange handlers before resolving
        // methods like signInWithPassword / updateUser. Awaiting here causes deadlock.
        // We also defer state updates to avoid re-renders that abort in-flight requests.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, s) => {
                if (!isMounted) return;
                // Defer state updates so they don't interrupt in-flight API calls
                setTimeout(() => {
                    if (!isMounted) return;
                    setSession(s);
                    setUser(s?.user ?? null);
                    if (s?.user) {
                        // Only re-fetch profile on sign-in events, not on USER_UPDATED
                        if (event !== 'USER_UPDATED') {
                            fetchProfile(s.user.id).catch((err) =>
                                console.warn('Profile fetch on auth change failed:', err)
                            );
                        }
                    } else {
                        setProfile(null);
                    }
                    if (isMounted) setIsLoading(false);
                }, 0);
            }
        );

        return () => {
            isMounted = false;
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    // ── Auth methods ──
    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    }, []);

    const signUp = useCallback(async (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName },
            },
        });
        return { error: error?.message ?? null };
    }, []);

    const signOut = useCallback(async () => {
        try {
            await supabase.auth.signOut({ scope: 'local' });
        } catch {
            // Clear local state even if the server call fails
        }
        setSession(null);
        setUser(null);
        setProfile(null);
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error: error?.message ?? null };
    }, []);

    const updatePassword = useCallback(async (newPassword: string) => {
        try {
            const { data, error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) {
                console.error('Password update error:', error.message);
                return { error: error.message };
            }
            if (!data?.user) {
                return { error: 'Password update failed. Please try again.' };
            }
            return { error: null };
        } catch (err) {
            console.error('Password update exception:', err);
            return { error: 'Something went wrong. Please try again.' };
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                session,
                user,
                profile,
                role,
                roleLabel,
                isLoading,
                signIn,
                signUp,
                signOut,
                resetPassword,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ──
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
