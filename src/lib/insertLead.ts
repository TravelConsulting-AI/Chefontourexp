import { supabase } from './supabase';
import type { Json } from './database.types';
import { DESTINATION_SLUG_MAP } from './destinationMap';

// ── Types ──

export type LeadSource = 'home' | 'tour_fixed' | 'tour_custom' | 'reseller' | 'unknown';
export type DepartureType = 'fixed' | 'custom' | 'flexible' | 'none';

export interface LeadPayload {
    // ── Structured columns (written to first-class lead fields) ──
    source: LeadSource;
    departureType: DepartureType;
    tourId: string | null;
    fixedDateId: string | null;
    customDepartureDate: string | null;      // ISO date string (start)
    customDepartureDateEnd: string | null;    // ISO date string (end)
    calendlyLink: string | null;

    // ── Overflow fields (written to details JSONB) ──
    experienceType: string;
    groupSize: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    scheduleCall: boolean;
    comments: string;

    // ── Optional: destination label from BookingModal (for resolving tour_id) ──
    destinationLabel?: string;
}

/**
 * Resolve a human-readable destination label (e.g. "Málaga, Spain")
 * to a tour_id by looking up the canonical_slug in the tours table.
 */
async function resolveTourIdFromDestination(
    destinationLabel: string
): Promise<string | null> {
    const slug = DESTINATION_SLUG_MAP[destinationLabel];
    if (!slug) return null;

    const { data } = await supabase
        .from('tours')
        .select('id')
        .eq('canonical_slug', slug)
        .single();

    return data?.id ?? null;
}

/**
 * Single entry point for all lead intake forms.
 * Writes structured columns on the lead row, plus overflow in details JSONB.
 */
export async function insertLead(payload: LeadPayload) {
    const leadType =
        payload.experienceType === 'Team / Incentive Experience'
            ? 'Company'
            : 'Individual';

    // ── Resolve tour_id from destination label if not already set ──
    let tourId = payload.tourId;
    if (!tourId && payload.destinationLabel && payload.destinationLabel !== 'Other') {
        tourId = await resolveTourIdFromDestination(payload.destinationLabel);
    }

    // ── Determine departure type ──
    // If tour_id was resolved from destination but no dates, mark as flexible
    let departureType = payload.departureType;
    if (tourId && departureType === 'none') {
        departureType = 'flexible';
    }

    // Overflow JSONB — contact + preference data
    const details: Record<string, Json> = {
        experience_type: payload.experienceType || null,
        group_size: payload.groupSize || null,
        first_name: payload.firstName || null,
        last_name: payload.lastName || null,
        email: payload.email || null,
        phone: payload.phone || null,
        schedule_call: payload.scheduleCall,
        comments: payload.comments || null,
        // Store the raw destination label for reference (BookingModal only)
        ...(payload.destinationLabel ? { destination: payload.destinationLabel } : {}),
    };

    // Resolve traveler_id: use logged-in user if available
    const { data: { session } } = await supabase.auth.getSession();
    const travelerId = session?.user?.id ?? null;

    const calendlyLink = payload.calendlyLink ?? null;

    const { error } = await supabase.from('leads').insert({
        // Structured columns
        traveler_id: travelerId,
        lead_type: leadType,
        status: 'new' as const,
        source: payload.source,
        departure_type: departureType,
        tour_id: tourId ?? null,
        fixed_date_id: payload.fixedDateId ?? null,
        custom_departure_date: payload.customDepartureDate ?? null,
        custom_departure_date_end: payload.customDepartureDateEnd ?? null,
        calendly_link: calendlyLink,
        // JSONB overflow
        details,
    });

    // Calendly enrichment is handled server-side by the
    // enrich_calendly_lead Postgres trigger → calendly-enrich Edge Function

    return { error };
}
