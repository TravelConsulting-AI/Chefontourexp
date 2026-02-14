import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Destination {
    id: string;
    title: string;
    canonical_slug: string;
    destination_label: string;
}

/**
 * Fetches published tour destinations from Supabase.
 * Returns sorted destination labels for form dropdowns,
 * plus a helper to resolve a destination label → tour_id.
 */
export function useDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchDestinations() {
            const { data, error } = await supabase
                .from('tours')
                .select('id, title, canonical_slug, destination_label')
                .not('destination_label', 'is', null)
                .order('destination_label');

            if (!cancelled) {
                if (error) {
                    console.warn('Could not fetch destinations:', error.message);
                } else {
                    setDestinations(
                        (data ?? []).map((d: any) => ({
                            id: d.id,
                            title: d.title,
                            canonical_slug: d.canonical_slug,
                            destination_label: d.destination_label,
                        }))
                    );
                }
                setIsLoading(false);
            }
        }

        fetchDestinations();
        return () => { cancelled = true; };
    }, []);

    /** Dropdown options: all destination labels + "Other" */
    const destinationOptions = [
        ...destinations.map((d) => d.destination_label),
        'Other',
    ];

    /** Given a destination label, return the tour_id (or null for "Other") */
    function resolveTourId(label: string): string | null {
        const match = destinations.find((d) => d.destination_label === label);
        return match?.id ?? null;
    }

    /** Given a destination label, return the canonical_slug */
    function resolveSlug(label: string): string | null {
        const match = destinations.find((d) => d.destination_label === label);
        return match?.canonical_slug ?? null;
    }

    return { destinations, destinationOptions, resolveTourId, resolveSlug, isLoading };
}
