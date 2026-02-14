import { Link } from 'react-router-dom';
import { StatusBadge } from '@/app/components/ui/StatusBadge';
import { parseScheduleDate } from '@/utils/formatScheduleDate';
import type { LeadWithTraveler } from '@/app/hooks/useLeads';

/** Format timestamptz values — uses native new Date() which is correct for timestamps */
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Format a Postgres date column (YYYY-MM-DD) avoiding UTC shift */
function formatScheduleDate(dateStr: string): string {
    return parseScheduleDate(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Derive departure label from structured columns */
function getDepartureLabel(lead: LeadWithTraveler): string {
    if (lead.departure_type === 'fixed' && lead.schedule_start) {
        return formatScheduleDate(lead.schedule_start);
    }
    if (lead.departure_type === 'custom' && lead.custom_departure_date) {
        const startLabel = formatScheduleDate(lead.custom_departure_date);
        if (lead.custom_departure_date_end) {
            return `${startLabel} – ${formatScheduleDate(lead.custom_departure_date_end)}`;
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
            <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-black/5" /></td>
            <td className="px-5 py-4"><div className="h-4 w-32 rounded bg-black/5" /></td>
            <td className="px-5 py-4"><div className="h-4 w-28 rounded bg-black/5" /></td>
            <td className="px-5 py-4"><div className="h-4 w-24 rounded bg-black/5" /></td>
            <td className="px-5 py-4"><div className="h-5 w-20 rounded-full bg-black/5" /></td>
        </tr>
    );
}

interface LeadTableProps {
    leads: LeadWithTraveler[];
    isLoading: boolean;
    onSelectLead: (lead: LeadWithTraveler) => void;
}

export function LeadTable({ leads, isLoading, onSelectLead }: LeadTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#F8F6F3]">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-black/5">
                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                            Submitted
                        </th>
                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                            Traveler
                        </th>
                        <th className="hidden md:table-cell px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                            Tour
                        </th>
                        <th className="hidden md:table-cell px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                            Departure
                        </th>
                        <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                    {isLoading ? (
                        <>
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                        </>
                    ) : leads.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-8 py-12 text-center">
                                <p className="text-sm font-medium text-[#1a1a1a]/60">No leads found</p>
                                <p className="mt-1 text-xs text-[#1a1a1a]/40">
                                    Leads will appear here when travelers submit requests.
                                </p>
                            </td>
                        </tr>
                    ) : (
                        leads.map((lead) => (
                            <tr
                                key={lead.id}
                                onClick={() => onSelectLead(lead)}
                                className="cursor-pointer transition-colors hover:bg-black/[0.02]"
                            >
                                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1a1a1a]/70">
                                    {formatDate(lead.created_at)}
                                </td>
                                <td className="px-5 py-4 text-sm font-medium text-[#1a1a1a]">
                                    {lead.traveler_name}
                                </td>
                                <td className="hidden md:table-cell whitespace-nowrap px-5 py-4 text-sm text-[#1a1a1a]/70">
                                    {lead.canonical_slug ? (
                                        <Link
                                            to={`/experiences/${lead.canonical_slug}`}
                                            className="font-medium text-[#D4A574] hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {lead.tour_title}
                                        </Link>
                                    ) : (
                                        lead.tour_title || '—'
                                    )}
                                </td>
                                <td className="hidden md:table-cell whitespace-nowrap px-5 py-4 text-sm text-[#1a1a1a]/70">
                                    {getDepartureLabel(lead)}
                                </td>
                                <td className="whitespace-nowrap px-5 py-4">
                                    <StatusBadge status={lead.status} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
