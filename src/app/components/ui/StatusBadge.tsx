import { STATUS_CONFIG, type LeadStatus } from '@/lib/roles';

export function StatusBadge({ status }: { status: LeadStatus }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
        >
            {cfg.label}
        </span>
    );
}
