import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface TourOption {
    id: string;
    title: string;
    canonical_slug: string | null;
}

export interface ScheduleOption {
    id: string;
    tour_id: string;
    start_date: string;
    end_date: string | null;
    status: string;
}

/**
 * Fetches ALL tours and ALL schedules for use in admin drawer dropdowns.
 * No filtering by active/status — admin must see everything including "Coming Soon" tours.
 * Cached in state — re-mounts re-fetch automatically.
 */
export function useTourOptions() {
    const [tours, setTours] = useState<TourOption[]>([]);
    const [schedules, setSchedules] = useState<ScheduleOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [toursRes, schedulesRes] = await Promise.all([
                supabase
                    .from('tours')
                    .select('id, title, canonical_slug')
                    .order('title'),
                supabase
                    .from('tour_schedules')
                    .select('id, tour_id, start_date, end_date, status')
                    .order('start_date'),
            ]);

            if (toursRes.data) setTours(toursRes.data as TourOption[]);
            if (schedulesRes.data) setSchedules(schedulesRes.data as ScheduleOption[]);
            setIsLoading(false);
        }
        load();
    }, []);

    /** Get schedules filtered by a specific tour_id */
    function getSchedulesForTour(tourId: string | null): ScheduleOption[] {
        if (!tourId) return [];
        return schedules.filter((s) => s.tour_id === tourId);
    }

    return { tours, schedules, getSchedulesForTour, isLoading };
}
