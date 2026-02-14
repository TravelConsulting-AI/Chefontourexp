import type { Database } from './database.types';

export type UserRole = Database['public']['Enums']['user_role'];
export type LeadStatus = Database['public']['Enums']['lead_status'];

// ── Permission checks ──
// Centralised here so components never compare raw role strings.

/** Can access the admin panel (superadmin, leadership). */
export const canViewAdmin = (role: UserRole | null) =>
    role === 'superadmin' || role === 'leadership';

/** Can change a lead's status (superadmin, leadership). */
export const canUpdateLeadStatus = (r: UserRole | null): boolean =>
    r === 'superadmin' || r === 'leadership';

/** Can edit lead details JSONB (superadmin, leadership). */
export const canEditLead = (r: UserRole | null): boolean =>
    r === 'superadmin' || r === 'leadership';

/** Can reassign a lead's tour (superadmin only). */
export const canReassignTour = (r: UserRole | null): boolean =>
    r === 'superadmin';

/** Only sees their own leads (reseller via created_by, traveler via traveler_id). */
export const canViewOwnLeads = (r: UserRole | null): boolean =>
    r === 'reseller' || r === 'traveler';

/** Broad admin-tier check for UI gating. */
export const isAdminRole = (r: UserRole | null): boolean =>
    r === 'superadmin' || r === 'leadership';

// ── Status display config ──
export const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string }> = {
    new: { label: 'New', bg: 'bg-amber-50', text: 'text-amber-700' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700' },
    confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-600' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600' },
};

export const LEAD_STATUSES: LeadStatus[] = [
    'new', 'in_progress', 'confirmed', 'completed', 'cancelled',
];
