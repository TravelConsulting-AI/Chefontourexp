import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';
import type { Database } from '@/lib/database.types';
import type { LeadStatus } from '@/lib/roles';

// ── Types ──
type LeadRow = Database['public']['Tables']['leads']['Row'];

export interface LeadWithTraveler extends LeadRow {
    traveler_name: string;
    tour_title: string | null;
    canonical_slug: string | null;
    schedule_start: string | null;
    schedule_end: string | null;
}

export interface LeadUpdatePayload {
    // Structured columns
    tour_id?: string | null;
    fixed_date_id?: string | null;
    departure_type?: string;
    custom_departure_date?: string | null;
    custom_departure_date_end?: string | null;
    calendly_link?: string | null;
    internal_notes?: string | null;
    status?: LeadStatus;
    // JSON fields to merge into details
    detailsMerge?: Record<string, unknown>;
}

/**
 * Role-aware lead fetching hook.
 * RLS handles server-side filtering — we just SELECT * ORDER BY created_at DESC.
 * The hook joins profiles, tours, and tour_schedules for display.
 */
export function useLeads() {
    const { user } = useAuth();
    const [leads, setLeads] = useState<LeadWithTraveler[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeads = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        const { data, error: err } = await supabase
            .from('leads')
            .select(`
                *,
                traveler:profiles!leads_traveler_id_fkey (first_name, last_name),
                tour:tours (title, canonical_slug),
                schedule:tour_schedules (start_date, end_date)
            `)
            .order('created_at', { ascending: false });

        if (err) {
            console.warn('Could not fetch leads:', err.message);
            setError(err.message);
            setLeads([]);
        } else {
            const mapped: LeadWithTraveler[] = (data ?? []).map((row: any) => {
                const t = row.traveler;
                const name = t
                    ? `${t.first_name || ''} ${t.last_name || ''}`.trim()
                    : 'Unknown';
                return {
                    ...row,
                    traveler_name: name || 'Unknown',
                    tour_title: row.tour?.title ?? null,
                    canonical_slug: row.tour?.canonical_slug ?? null,
                    schedule_start: row.schedule?.start_date ?? null,
                    schedule_end: row.schedule?.end_date ?? null,
                    traveler: undefined,
                    tour: undefined,
                    schedule: undefined,
                };
            });
            setLeads(mapped);
        }

        setIsLoading(false);
    }, [user?.id]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    // ── Status update (used by StatusDropdown directly) ──
    const updateLeadStatus = useCallback(
        async (leadId: string, newStatus: LeadStatus) => {
            const { error: err } = await supabase
                .from('leads')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', leadId);

            if (err) {
                return { error: err.message };
            }

            // Optimistically update local state
            setLeads((prev) =>
                prev.map((l) =>
                    l.id === leadId ? { ...l, status: newStatus } : l
                )
            );

            return { error: null };
        },
        []
    );

    // ── Unified lead update (structured cols + JSON merge) ──

    const updateLead = useCallback(
        async (leadId: string, payload: LeadUpdatePayload) => {
            // Build the DB update object
            const { detailsMerge, ...structuredFields } = payload;

            // Get existing details for merge
            const existingLead = leads.find((l) => l.id === leadId);
            const existingDetails: Record<string, unknown> =
                existingLead && typeof existingLead.details === 'object' && existingLead.details !== null
                    ? (existingLead.details as Record<string, unknown>)
                    : {};

            const mergedDetails = detailsMerge
                ? { ...existingDetails, ...detailsMerge }
                : existingDetails;

            const updateObj: Record<string, unknown> = {
                ...structuredFields,
                details: mergedDetails,
                updated_at: new Date().toISOString(),
            };

            const { error: err } = await supabase
                .from('leads')
                .update(updateObj as any)
                .eq('id', leadId);

            if (err) {
                return { error: err.message };
            }

            // Refetch to rebuild joins (tour_title, schedule dates, etc.)
            await fetchLeads();
            return { error: null };
        },
        [leads, fetchLeads]
    );

    const deleteLead = useCallback(
        async (leadId: string) => {
            const { error: err } = await supabase
                .from('leads')
                .delete()
                .eq('id', leadId);

            if (err) {
                return { error: err.message };
            }

            // Optimistically remove from local state
            setLeads((prev) => prev.filter((l) => l.id !== leadId));
            return { error: null };
        },
        []
    );

    return { leads, isLoading, error, refetch: fetchLeads, updateLeadStatus, updateLead, deleteLead };
}
