import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, Pencil, Save, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/app/components/ui/StatusBadge';
import { StatusDropdown } from './StatusDropdown';
import { parseScheduleDate } from '@/utils/formatScheduleDate';
import {
    canUpdateLeadStatus,
    canEditLead,
    canReassignTour,
    type LeadStatus,
} from '@/lib/roles';
import { useAuth } from '@/app/context/AuthContext';
import { isDetailsRecord } from '@/lib/detailsUtils';
import type { LeadWithTraveler, LeadUpdatePayload } from '@/app/hooks/useLeads';
import type { TourOption, ScheduleOption } from '@/app/hooks/useTourOptions';

// ── Helpers ──

/** Format timestamptz values (created_at, updated_at) — native new Date() is correct */
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Format Postgres date columns (YYYY-MM-DD) — uses parseScheduleDate to avoid UTC shift */
function formatSchedDate(dateStr: string) {
    return parseScheduleDate(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatSchedShortDate(dateStr: string) {
    return parseScheduleDate(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// ── Draft State ──

interface DrawerDraft {
    // Structured columns
    tour_id: string | null;
    fixed_date_id: string | null;
    departure_type: string;
    custom_departure_date: string | null;
    custom_departure_date_end: string | null;
    calendly_link: string | null;
    internal_notes: string | null;
    // JSON-backed fields
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    experience_type: string;
    group_size: string;
    comments: string;
}

function buildDraft(lead: LeadWithTraveler): DrawerDraft {
    const d = isDetailsRecord(lead.details)
        ? (lead.details as Record<string, unknown>)
        : {};
    return {
        tour_id: lead.tour_id,
        fixed_date_id: lead.fixed_date_id,
        departure_type: lead.departure_type || 'none',
        custom_departure_date: lead.custom_departure_date,
        custom_departure_date_end: lead.custom_departure_date_end ?? null,
        calendly_link: lead.calendly_link,
        internal_notes: lead.internal_notes,
        first_name: (d.firstName as string) || '',
        last_name: (d.lastName as string) || '',
        email: (d.email as string) || '',
        phone: (d.phone as string) || '',
        experience_type: (d.experienceType as string) || '',
        group_size: (d.groupSize as string) || '',
        comments: (d.comments as string) || '',
    };
}

// ── Validation ──

function validateDeparture(draft: DrawerDraft): string | null {
    if (draft.departure_type === 'fixed') {
        if (!draft.fixed_date_id) return 'Fixed departure requires a schedule selection.';
        if (draft.custom_departure_date) return 'Fixed departure cannot have a custom date.';
    }
    if (draft.departure_type === 'custom') {
        if (!draft.custom_departure_date) return 'Custom departure requires a start date.';
        if (draft.fixed_date_id) return 'Custom departure cannot have a fixed schedule.';
    }
    if (draft.departure_type === 'flexible') {
        if (draft.fixed_date_id) return 'Flexible departure cannot have a fixed schedule.';
    }
    if (draft.departure_type === 'none') {
        if (draft.fixed_date_id || draft.custom_departure_date)
            return 'No departure type selected — clear schedule and custom date.';
    }
    return null;
}

// ── Props ──

interface LeadDrawerProps {
    lead: LeadWithTraveler | null;
    onClose: () => void;
    onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<{ error: string | null }>;
    onSave: (leadId: string, payload: LeadUpdatePayload) => Promise<{ error: string | null }>;
    tours: TourOption[];
    getSchedulesForTour: (tourId: string | null) => ScheduleOption[];
}

// ── Main Component ──

export function LeadDrawer({
    lead,
    onClose,
    onStatusChange,
    onSave,
    tours,
    getSchedulesForTour,
}: LeadDrawerProps) {
    const { role } = useAuth();
    const panelRef = useRef<HTMLDivElement>(null);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState<DrawerDraft | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Raw payload collapse
    const [isRawOpen, setIsRawOpen] = useState(false);

    // Reset edit state when lead changes
    useEffect(() => {
        setIsEditing(false);
        setDraft(null);
        setValidationError(null);
        setIsRawOpen(false);
    }, [lead?.id]);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isEditing) {
                    setIsEditing(false);
                    setValidationError(null);
                } else {
                    onClose();
                }
            }
        };
        if (lead) {
            document.addEventListener('keydown', handler);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [lead, onClose, isEditing]);

    // ── Edit helpers ──

    const startEditing = useCallback(() => {
        if (!lead) return;
        setDraft(buildDraft(lead));
        setIsEditing(true);
        setValidationError(null);
    }, [lead]);

    function updateDraft<K extends keyof DrawerDraft>(key: K, value: DrawerDraft[K]) {
        setDraft((prev) => {
            if (!prev) return prev;
            const next = { ...prev, [key]: value };

            // Departure type side effects
            if (key === 'departure_type') {
                if (value === 'fixed') {
                    next.custom_departure_date = null;
                    next.custom_departure_date_end = null;
                } else if (value === 'custom') {
                    next.fixed_date_id = null;
                } else if (value === 'flexible') {
                    next.fixed_date_id = null;
                    next.custom_departure_date = null;
                    next.custom_departure_date_end = null;
                } else {
                    next.fixed_date_id = null;
                    next.custom_departure_date = null;
                    next.custom_departure_date_end = null;
                }
            }

            // Tour change → reset schedule + check if new tour has schedules
            if (key === 'tour_id') {
                next.fixed_date_id = null;
                const tourSchedules = getSchedulesForTour(value as string | null);
                // If the new tour has no schedules and was on fixed, switch to none
                if (tourSchedules.length === 0 && next.departure_type === 'fixed') {
                    next.departure_type = 'none';
                }
            }

            setValidationError(null);
            return next;
        });
    }

    async function handleSave() {
        if (!lead || !draft) return;

        const ve = validateDeparture(draft);
        if (ve) {
            setValidationError(ve);
            toast.error(ve);
            return;
        }

        setIsSaving(true);

        const payload: LeadUpdatePayload = {
            tour_id: draft.tour_id,
            fixed_date_id: draft.fixed_date_id,
            departure_type: draft.departure_type,
            custom_departure_date: draft.custom_departure_date,
            custom_departure_date_end: draft.custom_departure_date_end,
            calendly_link: draft.calendly_link,
            internal_notes: draft.internal_notes,
            detailsMerge: {
                firstName: draft.first_name,
                lastName: draft.last_name,
                email: draft.email,
                phone: draft.phone,
                experienceType: draft.experience_type,
                groupSize: draft.group_size,
                comments: draft.comments,
            },
        };

        const result = await onSave(lead.id, payload);
        setIsSaving(false);

        if (result.error) {
            toast.error('Failed to save: ' + result.error);
        } else {
            toast.success('Lead updated successfully');
            setIsEditing(false);
            setValidationError(null);
        }
    }

    // ── Derived data ──

    const isOpen = !!lead;
    const details: Record<string, unknown> = lead && isDetailsRecord(lead.details)
        ? (lead.details as Record<string, unknown>)
        : {};

    const editable = canEditLead(role);
    const canReassign = canReassignTour(role);

    // Current values (show draft if editing, lead data if not)
    const tourId = isEditing && draft ? draft.tour_id : lead?.tour_id ?? null;
    const filteredSchedules = getSchedulesForTour(tourId);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                ref={panelRef}
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {lead && (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
                            <h2
                                className="text-lg font-semibold text-[#1a1a1a]"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Lead Details
                            </h2>
                            <div className="flex items-center gap-2">
                                {editable && !isEditing && (
                                    <button
                                        onClick={startEditing}
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#D4A574] transition-colors hover:bg-[#D4A574]/10"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="rounded-full p-1.5 text-[#1a1a1a]/40 transition-colors hover:bg-black/5 hover:text-[#1a1a1a]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">

                            {/* ═══════════════════════════════════════════
                                SECTION A — Trip Routing
                                ═══════════════════════════════════════════ */}
                            <SectionHeader label="Trip Routing" />
                            <div className="mb-6 rounded-xl bg-[#F8F6F3] p-4 space-y-4">

                                {/* Tour */}
                                {isEditing && draft ? (
                                    <div>
                                        <FieldLabel>Tour</FieldLabel>
                                        <select
                                            value={draft.tour_id || ''}
                                            onChange={(e) => updateDraft('tour_id', e.target.value || null)}
                                            disabled={!canReassign}
                                            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">No tour assigned</option>
                                            {tours.map((t) => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                        {!canReassign && (
                                            <p className="mt-1 text-xs text-[#1a1a1a]/30">
                                                Only superadmin can reassign tours
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <InfoRow label="Tour" value={lead.tour_title || '—'} />
                                        {lead.canonical_slug && (
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                                                    URL
                                                </span>
                                                <Link
                                                    to={`/experiences/${lead.canonical_slug}`}
                                                    className="text-right text-sm font-medium text-[#D4A574] hover:underline truncate max-w-[200px]"
                                                >
                                                    /experiences/{lead.canonical_slug}
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Departure Type */}
                                {isEditing && draft ? (
                                    <div>
                                        <FieldLabel>Departure Type</FieldLabel>
                                        <select
                                            value={draft.departure_type}
                                            onChange={(e) => updateDraft('departure_type', e.target.value)}
                                            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
                                        >
                                            <option value="none">None</option>
                                            <option value="fixed">Fixed Date</option>
                                            <option value="custom">Custom Date</option>
                                            <option value="flexible">Flexible</option>
                                        </select>
                                    </div>
                                ) : (
                                    lead.departure_type && lead.departure_type !== 'none' && (
                                        <InfoRow
                                            label="Departure"
                                            value={
                                                lead.departure_type === 'fixed' ? 'Fixed Date'
                                                    : lead.departure_type === 'custom' ? 'Custom Date'
                                                        : lead.departure_type === 'flexible' ? 'Flexible'
                                                            : lead.departure_type
                                            }
                                        />
                                    )
                                )}

                                {/* Fixed: Schedule dropdown */}
                                {isEditing && draft && draft.departure_type === 'fixed' && (
                                    <div>
                                        <FieldLabel>Schedule</FieldLabel>
                                        {filteredSchedules.length > 0 ? (
                                            <select
                                                value={draft.fixed_date_id || ''}
                                                onChange={(e) => updateDraft('fixed_date_id', e.target.value || null)}
                                                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
                                            >
                                                <option value="">Select a schedule…</option>
                                                {filteredSchedules.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {formatSchedShortDate(s.start_date)}
                                                        {s.end_date ? ` — ${formatSchedShortDate(s.end_date)}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <select
                                                disabled
                                                className="w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm text-[#1a1a1a]/40 outline-none cursor-not-allowed"
                                            >
                                                <option>No Fixed Departures</option>
                                            </select>
                                        )}
                                    </div>
                                )}

                                {/* Fixed: Read-only schedule display */}
                                {!isEditing && lead.schedule_start && (
                                    <>
                                        <InfoRow label="Start" value={formatSchedDate(lead.schedule_start)} />
                                        {lead.schedule_end && (
                                            <InfoRow label="End" value={formatSchedDate(lead.schedule_end)} />
                                        )}
                                    </>
                                )}

                                {/* Custom: Date picker (start + end) */}
                                {isEditing && draft && draft.departure_type === 'custom' && (
                                    <div className="space-y-3">
                                        <div>
                                            <FieldLabel>Custom Start Date</FieldLabel>
                                            <input
                                                type="date"
                                                value={draft.custom_departure_date || ''}
                                                onChange={(e) => updateDraft('custom_departure_date', e.target.value || null)}
                                                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Custom End Date</FieldLabel>
                                            <input
                                                type="date"
                                                value={draft.custom_departure_date_end || ''}
                                                onChange={(e) => updateDraft('custom_departure_date_end', e.target.value || null)}
                                                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Custom: Read-only date display */}
                                {!isEditing && lead.custom_departure_date && (
                                    <>
                                        <InfoRow label="Custom Start" value={formatSchedDate(lead.custom_departure_date)} />
                                        {lead.custom_departure_date_end && (
                                            <InfoRow label="Custom End" value={formatSchedDate(lead.custom_departure_date_end)} />
                                        )}
                                    </>
                                )}

                                {/* Status */}
                                <div>
                                    <FieldLabel>Status</FieldLabel>
                                    {canUpdateLeadStatus(role) ? (
                                        <StatusDropdown
                                            currentStatus={lead.status}
                                            onStatusChange={(s) => onStatusChange(lead.id, s)}
                                        />
                                    ) : (
                                        <StatusBadge status={lead.status} />
                                    )}
                                </div>

                                {/* Source (read-only badge) */}
                                {lead.source && (
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                                            Source
                                        </span>
                                        <span className="rounded-full bg-[#D4A574]/10 px-3 py-0.5 text-xs font-medium text-[#D4A574]">
                                            {lead.source}
                                        </span>
                                    </div>
                                )}

                                {/* Calendly Link */}
                                {isEditing && draft ? (
                                    draft.calendly_link !== null && (
                                        <div>
                                            <FieldLabel>Calendly Link</FieldLabel>
                                            <input
                                                type="url"
                                                value={draft.calendly_link || ''}
                                                onChange={(e) => updateDraft('calendly_link', e.target.value || null)}
                                                placeholder="https://calendly.com/..."
                                                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
                                            />
                                        </div>
                                    )
                                ) : (
                                    lead.calendly_link && (
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                                                Calendly
                                            </span>
                                            <a
                                                href={lead.calendly_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-right text-sm font-medium text-[#D4A574] hover:underline truncate max-w-[200px]"
                                            >
                                                View Event
                                            </a>
                                        </div>
                                    )
                                )}

                                {/* Internal Notes */}
                                {isEditing && draft ? (
                                    <div>
                                        <FieldLabel>Internal Notes</FieldLabel>
                                        <textarea
                                            value={draft.internal_notes || ''}
                                            onChange={(e) => updateDraft('internal_notes', e.target.value || null)}
                                            rows={3}
                                            placeholder="Add internal notes..."
                                            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
                                        />
                                    </div>
                                ) : lead.internal_notes ? (
                                    <div>
                                        <span className="text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                                            Internal Notes
                                        </span>
                                        <p className="mt-1 rounded-lg bg-white/60 p-3 text-sm leading-relaxed text-[#1a1a1a]/80">
                                            {lead.internal_notes}
                                        </p>
                                    </div>
                                ) : null}

                                {/* Validation error */}
                                {validationError && (
                                    <p className="text-xs font-medium text-red-500">{validationError}</p>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════
                                SECTION B — Traveler Info
                                ═══════════════════════════════════════════ */}
                            <SectionHeader label="Traveler Info" />
                            <div className="mb-6 space-y-4">
                                {isEditing && draft ? (
                                    <>
                                        <EditableTextField label="First Name" value={draft.first_name} onChange={(v) => updateDraft('first_name', v)} />
                                        <EditableTextField label="Last Name" value={draft.last_name} onChange={(v) => updateDraft('last_name', v)} />
                                        <EditableTextField label="Email" value={draft.email} onChange={(v) => updateDraft('email', v)} type="email" />
                                        <EditableTextField label="Phone" value={draft.phone} onChange={(v) => updateDraft('phone', v)} type="tel" />
                                    </>
                                ) : (
                                    <>
                                        <InfoRow label="Name" value={lead.traveler_name} />
                                        {(details.email as string) && <InfoRow label="Email" value={details.email as string} />}
                                        {(details.phone as string) && <InfoRow label="Phone" value={details.phone as string} />}
                                    </>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════
                                SECTION C — Experience Details
                                ═══════════════════════════════════════════ */}
                            <SectionHeader label="Experience Details" />
                            <div className="mb-6 space-y-4">
                                {isEditing && draft ? (
                                    <>
                                        <EditableTextField label="Experience Type" value={draft.experience_type} onChange={(v) => updateDraft('experience_type', v)} />
                                        <EditableTextField label="Group Size" value={draft.group_size} onChange={(v) => updateDraft('group_size', v)} />
                                    </>
                                ) : (
                                    <>
                                        {(details.experienceType as string) && (
                                            <InfoRow label="Experience" value={details.experienceType as string} />
                                        )}
                                        {(details.groupSize as string) && (
                                            <InfoRow label="Group Size" value={details.groupSize as string} />
                                        )}
                                        {!(details.experienceType as string) && !(details.groupSize as string) && (
                                            <p className="text-sm italic text-[#1a1a1a]/30">No experience details.</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════
                                SECTION D — Comments
                                ═══════════════════════════════════════════ */}
                            <SectionHeader label="Traveler Comments" />
                            <div className="mb-6">
                                {isEditing && draft ? (
                                    <textarea
                                        value={draft.comments}
                                        onChange={(e) => updateDraft('comments', e.target.value)}
                                        rows={3}
                                        placeholder="No comments"
                                        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
                                    />
                                ) : (details.comments as string) ? (
                                    <p className="rounded-lg bg-[#F8F6F3] p-3 text-sm leading-relaxed text-[#1a1a1a]/80">
                                        {details.comments as string}
                                    </p>
                                ) : (
                                    <p className="text-sm italic text-[#1a1a1a]/30">No comments.</p>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════
                                SECTION E — Raw Payload
                                ═══════════════════════════════════════════ */}
                            <div className="mb-6 border-t border-black/5 pt-4">
                                <button
                                    onClick={() => setIsRawOpen(!isRawOpen)}
                                    className="flex w-full items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40 transition-colors hover:text-[#1a1a1a]/60"
                                >
                                    {isRawOpen ? (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    ) : (
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    )}
                                    Raw Payload
                                </button>
                                {isRawOpen && (
                                    <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-[#F8F6F3] p-3 text-xs leading-relaxed text-[#1a1a1a]/60">
                                        {JSON.stringify(details, null, 2) || '{}'}
                                    </pre>
                                )}
                            </div>

                            {/* ── Edit-mode Save / Cancel ── */}
                            {isEditing && (
                                <div className="sticky bottom-0 flex items-center gap-3 border-t border-black/5 bg-white pt-4 pb-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-1.5 rounded-lg bg-[#D4A574] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C19563] disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isSaving ? 'Saving…' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setValidationError(null);
                                        }}
                                        disabled={isSaving}
                                        className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-[#1a1a1a]/50 transition-colors hover:bg-black/5"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="mt-6 border-t border-black/5 pt-4">
                                <p className="text-xs text-[#1a1a1a]/30">
                                    Created {formatDate(lead.created_at)}
                                </p>
                                {lead.updated_at !== lead.created_at && (
                                    <p className="mt-0.5 text-xs text-[#1a1a1a]/30">
                                        Last updated {formatDate(lead.updated_at)}
                                    </p>
                                )}
                                <InfoRow label="Lead Type" value={lead.lead_type} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

// ── Small helper components ──

function SectionHeader({ label }: { label: string }) {
    return (
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40 border-b border-black/5 pb-2">
            {label}
        </p>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
            {children}
        </label>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/40">
                {label}
            </span>
            <span className="text-right text-sm font-medium text-[#1a1a1a]">{value}</span>
        </div>
    );
}

function EditableTextField({
    label,
    value,
    onChange,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: 'text' | 'email' | 'tel';
}) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#D4A574]"
            />
        </div>
    );
}
