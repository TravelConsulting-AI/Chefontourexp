/**
 * Utilities for dynamically rendering and editing lead.details JSONB.
 * No assumptions about form shape — works with any key set.
 */

/** Convert snake_case key to Title Case label. */
export function humanizeKey(key: string): string {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Determine the appropriate input type for a JSONB value. */
export function getInputType(
    value: unknown
): 'text' | 'textarea' | 'number' | 'boolean' | 'complex' {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string' && value.length > 100) return 'textarea';
    if (typeof value === 'string') return 'text';
    // arrays, objects, or anything else
    return 'complex';
}

/** Format a value for read-mode display. */
export function formatDisplayValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    // arrays / objects
    return JSON.stringify(value, null, 2);
}

/** Type guard: is the value a flat details record? */
export function isDetailsRecord(
    value: unknown
): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}
