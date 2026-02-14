import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth, ROLE_LABELS } from '@/app/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { StatusBadge } from '@/app/components/ui/StatusBadge';
import { parseScheduleDate } from '@/utils/formatScheduleDate';

// ── Lead type with joined data ──
interface AccountLead {
    id: string;
    created_at: string;
    status: 'new' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled';
    departure_type: string;
    custom_departure_date: string | null;
    custom_departure_date_end: string | null;
    tour_title: string | null;
    schedule_start: string | null;
}

/** Format timestamptz (created_at) — native new Date() is correct */
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Format Postgres date column (YYYY-MM-DD) — avoids UTC shift */
function formatScheduleDate(dateStr: string): string {
    return parseScheduleDate(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Derive departure label from structured columns */
function getDepartureLabel(lead: AccountLead): string {
    if (lead.departure_type === 'fixed' && lead.schedule_start) {
        return formatScheduleDate(lead.schedule_start);
    }
    if (lead.departure_type === 'custom' && lead.custom_departure_date) {
        const startLabel = formatScheduleDate(lead.custom_departure_date);
        if (lead.custom_departure_date_end) {
            const endLabel = formatScheduleDate(lead.custom_departure_date_end);
            return `${startLabel} – ${endLabel}`;
        }
        return startLabel;
    }
    if (lead.departure_type === 'flexible') {
        return 'Flexible';
    }
    return 'TBD';
}

// ── Skeleton row ──
function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-5 py-4"><div className="h-4 w-24 rounded bg-black/5" /></td>
            <td className="px-5 py-4"><div className="h-4 w-40 rounded bg-black/5" /></td>
            <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-black/5" /></td>
            <td className="px-5 py-4"><div className="h-5 w-20 rounded-full bg-black/5" /></td>
        </tr>
    );
}

export function AccountPage() {
    const { profile, user, roleLabel, updatePassword } = useAuth();
    const [leads, setLeads] = useState<AccountLead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwError, setPwError] = useState<string | null>(null);
    const [pwSubmitting, setPwSubmitting] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError(null);

        if (newPassword.length < 6) {
            setPwError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError('Passwords do not match');
            return;
        }

        setPwSubmitting(true);
        try {
            const { error } = await updatePassword(newPassword);
            if (error) {
                setPwError(error);
            } else {
                // Clear form and collapse
                setNewPassword('');
                setConfirmPassword('');
                setShowNew(false);
                setShowConfirm(false);
                setShowPasswordForm(false);
                // Show toast notification
                toast.success('Password Updated!', {
                    action: {
                        label: 'Ok',
                        onClick: () => { },
                    },
                    duration: 5000,
                });
            }
        } catch {
            setPwError('Something went wrong. Please try again.');
        } finally {
            setPwSubmitting(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchLeads = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('leads')
                .select(`
                    id,
                    created_at,
                    status,
                    departure_type,
                    custom_departure_date,
                    custom_departure_date_end,
                    tour:tours(title),
                    schedule:tour_schedules(start_date)
                `)
                .eq('traveler_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Could not fetch leads:', error.message);
            } else {
                const mapped: AccountLead[] = (data ?? []).map((row: any) => ({
                    id: row.id,
                    created_at: row.created_at,
                    status: row.status,
                    departure_type: row.departure_type,
                    custom_departure_date: row.custom_departure_date,
                    custom_departure_date_end: row.custom_departure_date_end,
                    tour_title: row.tour?.title ?? null,
                    schedule_start: row.schedule?.start_date ?? null,
                }));
                setLeads(mapped);
            }
            setIsLoading(false);
        };

        fetchLeads();
    }, [user?.id]);

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="mx-auto max-w-2xl px-4">
                {/* Header */}
                <h1
                    className="mb-2 text-4xl font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    My Account
                </h1>
                <p className="mb-10 text-[#1a1a1a]/50" style={{ fontFamily: 'var(--font-body)' }}>
                    Manage your profile and preferences
                </p>

                {/* Profile Card */}
                <div className="rounded-2xl border border-black/5 bg-[#F8F6F3] p-8">
                    {/* Avatar */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4A574] text-xl font-semibold text-white">
                            {(profile?.first_name?.[0] ?? '').toUpperCase()}
                            {(profile?.last_name?.[0] ?? '').toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#1a1a1a]">
                                {profile?.first_name} {profile?.last_name}
                            </h2>
                            {roleLabel && (
                                <span className="inline-block mt-1 rounded-full bg-[#D4A574]/15 px-3 py-0.5 text-xs font-medium text-[#D4A574]">
                                    {roleLabel}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-black/5 pb-4">
                            <span className="text-sm text-[#1a1a1a]/50">Email</span>
                            <span className="text-sm font-medium text-[#1a1a1a]">{user?.email}</span>
                        </div>
                        {profile?.cell_phone && (
                            <div className="flex items-center justify-between border-b border-black/5 pb-4">
                                <span className="text-sm text-[#1a1a1a]/50">Phone</span>
                                <span className="text-sm font-medium text-[#1a1a1a]">{profile.cell_phone}</span>
                            </div>
                        )}
                        {profile?.ig_handle && (
                            <div className="flex items-center justify-between border-b border-black/5 pb-4">
                                <span className="text-sm text-[#1a1a1a]/50">Instagram</span>
                                <span className="text-sm font-medium text-[#1a1a1a]">@{profile.ig_handle}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#1a1a1a]/50">Member Since</span>
                            <span className="text-sm font-medium text-[#1a1a1a]">
                                {profile?.created_at
                                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : '—'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Change Password ── */}
                <div className="mt-8">
                    <button
                        onClick={() => { setShowPasswordForm(!showPasswordForm); setPwError(null); }}
                        className="flex w-full items-center justify-between rounded-2xl border border-black/5 bg-[#F8F6F3] px-8 py-5 transition-colors hover:bg-[#F3F0EC]"
                    >
                        <h3
                            className="text-lg font-semibold text-[#1a1a1a]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            Change Password
                        </h3>
                        <ChevronDown
                            className={`h-5 w-5 text-[#1a1a1a]/40 transition-transform duration-200 ${showPasswordForm ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {showPasswordForm && (
                        <div className="mt-1 rounded-b-2xl border border-t-0 border-black/5 bg-[#F8F6F3] px-8 py-6">
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-[#1a1a1a]/50">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min. 6 characters"
                                            required
                                            minLength={6}
                                            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm text-[#1a1a1a] outline-none transition-all focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574]/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-[#1a1a1a]/50">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter your password"
                                            required
                                            minLength={6}
                                            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm text-[#1a1a1a] outline-none transition-all focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574]/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {pwError && <p className="text-sm text-red-500">{pwError}</p>}

                                <button
                                    type="submit"
                                    disabled={pwSubmitting}
                                    className="rounded-full bg-[#D4A574] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#C19563] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {pwSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* ── My Requests ── */}
                <div className="mt-8">
                    <h3
                        className="mb-4 text-lg font-semibold text-[#1a1a1a]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        My Requests
                    </h3>

                    <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#F8F6F3]">
                        {isLoading ? (
                            /* Loading skeleton */
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Submitted</th>
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Tour</th>
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Departure</th>
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </tbody>
                            </table>
                        ) : leads.length === 0 ? (
                            /* Empty state */
                            <div className="px-8 py-12 text-center">
                                <p className="mb-1 text-sm font-medium text-[#1a1a1a]/60">No requests yet</p>
                                <p className="mb-5 text-xs text-[#1a1a1a]/40">
                                    When you reserve a tour date, your request will appear here.
                                </p>
                                <Link
                                    to="/experiences"
                                    className="inline-block rounded-full bg-[#D4A574] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#C19563]"
                                >
                                    Browse Tours
                                </Link>
                            </div>
                        ) : (
                            /* Leads table */
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Request Date</th>
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Tour</th>
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Departure</th>
                                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="transition-colors hover:bg-black/[0.02]">
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1a1a1a]/70">
                                                {formatDate(lead.created_at)}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-medium text-[#1a1a1a]">
                                                {lead.tour_title || 'Custom Experience Request'}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1a1a1a]/70">
                                                {getDepartureLabel(lead)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <StatusBadge status={lead.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* My Bookings placeholder */}
                <div className="mt-8">
                    <div className="rounded-2xl border border-black/5 bg-[#F8F6F3] p-6 text-center">
                        <h3
                            className="mb-1 text-lg font-semibold text-[#1a1a1a]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            My Bookings
                        </h3>
                        <p className="text-sm text-[#1a1a1a]/40">Coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
