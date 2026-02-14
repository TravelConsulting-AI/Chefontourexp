/**
 * Parse a Postgres `date` column value (YYYY-MM-DD) as a local Date.
 *
 * `new Date('2026-03-05')` is interpreted as midnight UTC, which can
 * render as March 4 in US timezones.  This helper constructs the Date
 * using local year/month/day parts so no timezone shift occurs.
 *
 * Use ONLY for `tour_schedules.start_date`, `end_date`,
 * `lead.custom_departure_date`, and similar Postgres `date` columns.
 * Do NOT use for `created_at`, `updated_at`, or any `timestamptz`.
 */
export function parseScheduleDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}
