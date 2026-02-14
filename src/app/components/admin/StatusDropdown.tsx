import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LEAD_STATUSES, STATUS_CONFIG, type LeadStatus } from '@/lib/roles';

interface StatusDropdownProps {
    currentStatus: LeadStatus;
    onStatusChange: (newStatus: LeadStatus) => Promise<{ error: string | null }>;
}

export function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as LeadStatus;
        if (newStatus === currentStatus) return;

        setIsSaving(true);
        const { error } = await onStatusChange(newStatus);
        setIsSaving(false);

        if (error) {
            toast.error(`Failed to update status: ${error}`);
        } else {
            toast.success(`Status updated to "${STATUS_CONFIG[newStatus].label}"`);
        }
    };

    return (
        <div className="relative inline-flex items-center gap-2">
            <select
                value={currentStatus}
                onChange={handleChange}
                disabled={isSaving}
                className="appearance-none rounded-lg border border-black/10 bg-white px-3 py-2 pr-8 text-sm text-[#1a1a1a] outline-none transition-all focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                    </option>
                ))}
            </select>
            {/* Custom dropdown chevron */}
            <svg
                className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a1a]/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {isSaving && (
                <Loader2 className="h-4 w-4 animate-spin text-[#D4A574]" />
            )}
        </div>
    );
}
