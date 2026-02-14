import { useState, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useLeads, type LeadWithTraveler, type LeadUpdatePayload } from '@/app/hooks/useLeads';
import { useTourOptions } from '@/app/hooks/useTourOptions';
import { LeadTable } from '@/app/components/admin/LeadTable';
import { LeadDrawer } from '@/app/components/admin/LeadDrawer';
import type { LeadStatus } from '@/lib/roles';

export function AdminPage() {
    const { profile, roleLabel } = useAuth();
    const { leads, isLoading, updateLeadStatus, updateLead, deleteLead, refetch } = useLeads();
    const { tours, getSchedulesForTour } = useTourOptions();
    const [selectedLead, setSelectedLead] = useState<LeadWithTraveler | null>(null);

    // ── Summary card data ──
    const counts = useMemo(() => {
        const newCount = leads.filter((l) => l.status === 'new').length;
        const inProgress = leads.filter((l) => l.status === 'in_progress').length;
        const confirmed = leads.filter((l) => l.status === 'confirmed').length;
        return { newCount, inProgress, confirmed, total: leads.length };
    }, [leads]);

    const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
        const result = await updateLeadStatus(leadId, newStatus);
        // Update the drawer's copy so it shows the new status instantly
        if (!result.error) {
            setSelectedLead((prev) =>
                prev?.id === leadId ? { ...prev, status: newStatus } : prev
            );
        }
        return result;
    };

    const handleSave = async (leadId: string, payload: LeadUpdatePayload) => {
        const result = await updateLead(leadId, payload);
        if (!result.error) {
            // Find the updated lead from the refetched list
            // updateLead already refetches — just sync the drawer
            const updatedLead = leads.find((l) => l.id === leadId);
            if (updatedLead) {
                setSelectedLead(updatedLead);
            }
        }
        return result;
    };

    const handleDelete = async (leadId: string) => {
        const result = await deleteLead(leadId);
        if (!result.error) {
            setSelectedLead(null);
        }
        return result;
    };

    // Keep drawer in sync with lead list after refetches
    const drawerLead = selectedLead
        ? leads.find((l) => l.id === selectedLead.id) ?? selectedLead
        : null;

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="mx-auto max-w-5xl px-4">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1
                            className="mb-2 text-4xl font-semibold text-[#1a1a1a]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            Admin Dashboard
                        </h1>
                        <p className="text-[#1a1a1a]/50" style={{ fontFamily: 'var(--font-body)' }}>
                            Welcome back, {profile?.first_name}
                        </p>
                    </div>
                    {roleLabel && (
                        <span className="rounded-full bg-[#D4A574]/15 px-4 py-1.5 text-sm font-medium text-[#D4A574]">
                            {roleLabel}
                        </span>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        label="Total Leads"
                        value={isLoading ? '—' : String(counts.total)}
                        description="All incoming requests"
                        accentColor="bg-[#D4A574]/10 text-[#D4A574]"
                    />
                    <SummaryCard
                        label="New"
                        value={isLoading ? '—' : String(counts.newCount)}
                        description="Awaiting response"
                        accentColor="bg-amber-50 text-amber-600"
                    />
                    <SummaryCard
                        label="In Progress"
                        value={isLoading ? '—' : String(counts.inProgress)}
                        description="Currently being handled"
                        accentColor="bg-blue-50 text-blue-600"
                    />
                    <SummaryCard
                        label="Confirmed"
                        value={isLoading ? '—' : String(counts.confirmed)}
                        description="Upcoming experiences"
                        accentColor="bg-emerald-50 text-emerald-600"
                    />
                </div>

                {/* Lead List */}
                <div>
                    <h2
                        className="mb-4 text-lg font-semibold text-[#1a1a1a]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        All Leads
                    </h2>
                    <LeadTable
                        leads={leads}
                        isLoading={isLoading}
                        onSelectLead={setSelectedLead}
                    />
                </div>
            </div>

            {/* Detail Drawer */}
            <LeadDrawer
                lead={drawerLead}
                onClose={() => setSelectedLead(null)}
                onStatusChange={handleStatusChange}
                onSave={handleSave}
                onDelete={handleDelete}
                tours={tours}
                getSchedulesForTour={getSchedulesForTour}
            />
        </div>
    );
}

// ── Summary card ──
function SummaryCard({
    label,
    value,
    description,
    accentColor,
}: {
    label: string;
    value: string;
    description: string;
    accentColor: string;
}) {
    return (
        <div className="rounded-2xl border border-black/5 bg-[#F8F6F3] p-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                    {label}
                </p>
                <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${accentColor}`}>
                    {value}
                </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
            <p className="mt-1 text-xs text-[#1a1a1a]/40">{description}</p>
        </div>
    );
}
