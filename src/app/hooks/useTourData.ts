import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface TourSchedule {
    id: string;
    start_date: string;
    end_date: string | null;
}

interface TourData {
    tourId: string | null;
    title: string | null;
    schedules: TourSchedule[];
}

/**
 * Fetches tour data (id, title, schedules) by canonical_slug.
 * Returns tourId, title, and schedules array so pages can resolve fixedDateId from selectedDate.
 */
export function useTourData(canonicalSlug: string): TourData {
    const [tourId, setTourId] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [schedules, setSchedules] = useState<TourSchedule[]>([]);

    useEffect(() => {
        async function fetch() {
            const { data: tour } = await supabase
                .from('tours')
                .select('id, title')
                .eq('canonical_slug', canonicalSlug)
                .single();

            if (!tour) return;
            setTourId(tour.id);
            setTitle(tour.title);

            const { data: scheds } = await supabase
                .from('tour_schedules')
                .select('id, start_date, end_date')
                .eq('tour_id', tour.id)
                .order('start_date', { ascending: true });

            setSchedules(scheds ?? []);
        }
        fetch();
    }, [canonicalSlug]);

    return { tourId, title, schedules };
}

/**
 * Given schedules and a selected date string (YYYY-MM-DD),
 * returns the matching schedule ID or null.
 */
export function resolveFixedDateId(
    schedules: TourSchedule[],
    selectedDate: string | null
): string | null {
    if (!selectedDate) return null;
    const match = schedules.find((s) => s.start_date === selectedDate);
    return match?.id ?? null;
}
