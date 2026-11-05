import { and, count, desc, eq, ilike, inArray, or, type SQL } from 'drizzle-orm';
import { Download, Upload } from 'lucide-react';

import { RowActions } from '@/components/admin/RowActions';
import { CARD, CARD_TITLE, FIELD_INPUT, SECONDARY_BUTTON, SMALL_SECONDARY_BUTTON, fieldBorder } from '@/components/registration/field-styles';
import { signOutAdmin } from '@/lib/admin/actions';
import { requireAdmin } from '@/lib/admin/auth';
import { escapeLike } from '@/lib/admin/rules';
import { db } from '@/lib/db';
import { events, registrations, registrationStatus, type Registration } from '@/lib/db/schema';
import { EVENT_SLUG } from '@/lib/registration/content';
import { formatDeadline, seatDeadline } from '@/lib/registration/format';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<Registration['status'], string> = {
  pending: 'Payment pending',
  payment_submitted: 'Payment submitted',
  approved: 'Pass issued',
  waitlisted: 'Waitlisted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};
const SHOWN_STATUSES = registrationStatus.enumValues.filter((status) => status !== 'rejected');
const MEAL_LABELS = { veg: 'Veg', non_veg: 'Non-veg', jain: 'Jain' };
const ROW_LIMIT = 500; // ponytail: no paging. Search narrows it; add paging if an event outgrows this.

const single = (value?: string | string[]) => (typeof value === 'string' ? value.trim() : '');

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[#4C2A66]/50 bg-[#150D24] px-4 py-3">
      <p className="text-xl font-bold text-[#FBBF24]">{value}</p>
      <p className="mt-0.5 text-xs text-[#CFC5DC]">{label}</p>
    </div>
  );
}

export default async function AdminScdPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[] }>;
}) {
  const admin = await requireAdmin();

  const [event] = await db
    .select({ id: events.id, capacity: events.capacity, seatsTaken: events.seatsTaken })
    .from(events)
    .where(eq(events.slug, EVENT_SLUG))
    .limit(1);
  if (!event) return <p className="text-sm text-[#CFC5DC]">The event row is missing. Run the seed script.</p>;

  const params = await searchParams;
  const q = single(params.q);
  const statusParam = single(params.status);
  const status = SHOWN_STATUSES.find((value) => value === statusParam);

  const filters: (SQL | undefined)[] = [eq(registrations.eventId, event.id)];
  if (status) filters.push(eq(registrations.status, status));
  if (q) {
    const pattern = `%${escapeLike(q)}%`;
    filters.push(
      or(
        ilike(registrations.name, pattern),
        ilike(registrations.email, pattern),
        ilike(registrations.phone, pattern),
        ilike(registrations.ticketNo, pattern),
        ilike(registrations.builderId, pattern),
        ilike(registrations.utr, pattern),
        ilike(registrations.payerName, pattern),
      ),
    );
  }

  const [statusCounts, mealCounts, rows] = await Promise.all([
    db
      .select({ status: registrations.status, n: count() })
      .from(registrations)
      .where(eq(registrations.eventId, event.id))
      .groupBy(registrations.status),
    db
      .select({ meal: registrations.mealPref, n: count() })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, event.id),
          inArray(registrations.status, ['pending', 'payment_submitted', 'approved']),
        ),
      )
      .groupBy(registrations.mealPref),
    db
      .select()
      .from(registrations)
      .where(and(...filters))
      .orderBy(desc(registrations.createdAt))
      .limit(ROW_LIMIT + 1),
  ]);
  const countOf = (value: Registration['status']) => statusCounts.find((row) => row.status === value)?.n ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Community Day registrations</h1>
        <form action={signOutAdmin} className="flex items-center gap-3">
          <span className="text-xs text-[#A89DB5]">{admin}</span>
          <button type="submit" className={SMALL_SECONDARY_BUTTON}>
            Sign out
          </button>
        </form>
      </div>

      <section aria-label="Counts" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          label={event.capacity === null ? 'Seats taken (no limit set)' : `Seats taken of ${event.capacity}`}
          value={event.seatsTaken}
        />
        {SHOWN_STATUSES.map((value) => (
          <Stat key={value} label={STATUS_LABELS[value]} value={countOf(value)} />
        ))}
      </section>

      <p className="text-xs text-[#CFC5DC]">
        Meals for seat holders:{' '}
        {mealCounts.length
          ? mealCounts.map(({ meal, n }) => `${meal ? MEAL_LABELS[meal] : 'Not asked'} ${n}`).join(' · ')
          : 'none yet'}
      </p>

      <section aria-labelledby="statement-heading" className={`${CARD} flex items-center gap-3`}>
        <Upload className="size-5 shrink-0 text-[#4C2A66]" aria-hidden="true" />
        <div>
          <h2 id="statement-heading" className={CARD_TITLE}>
            Bank statement
          </h2>
          <p className="text-sm text-[#CFC5DC]">Upload coming soon. Until then, confirm payments by hand below.</p>
        </div>
      </section>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <form className="grid min-w-0 flex-1 basis-80 gap-2 sm:grid-cols-[minmax(0,1fr)_13rem_auto]">
          <input
            type="search"
            name="q"
            defaultValue={q}
            aria-label="Search by name, email, phone, ticket, Builder ID or UTR"
            placeholder="Name, email, phone, ticket, Builder ID, UTR"
            className={`${FIELD_INPUT} ${fieldBorder()}`}
          />
          <select
            name="status"
            defaultValue={status ?? ''}
            aria-label="Filter by status"
            className={`${FIELD_INPUT} ${fieldBorder()}`}
          >
            <option value="" className="bg-[#140C20]">
              All statuses
            </option>
            {SHOWN_STATUSES.map((value) => (
              <option key={value} value={value} className="bg-[#140C20]">
                {STATUS_LABELS[value]}
              </option>
            ))}
          </select>
          <button type="submit" className={SECONDARY_BUTTON}>
            Search
          </button>
        </form>
        <a href="/admin/scd/export" className={SECONDARY_BUTTON}>
          <Download className="size-4" aria-hidden="true" />
          Export CSV
        </a>
      </div>

      {rows.length > ROW_LIMIT && (
        <p role="status" className="text-xs text-[#FDE68A]">
          Showing the newest {ROW_LIMIT}. Search to narrow the list; the CSV has everyone.
        </p>
      )}

      <div className={`${CARD} overflow-x-auto p-0 sm:p-0`}>
        <table className="w-full min-w-[60rem] border-collapse text-left text-xs text-[#E9D5FF]">
          <thead className="font-mono text-[10px] tracking-wider text-amber-400/80 uppercase">
            <tr className="border-b border-[#4C2A66]/50">
              {['Ticket', 'Person', 'College', 'Status', 'Builder ID', 'Payment', 'Actions'].map((heading) => (
                <th key={heading} scope="col" className="px-4 py-3 font-bold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, ROW_LIMIT).map((row) => (
              <tr key={row.id} className="border-b border-[#4C2A66]/30 align-top last:border-0">
                <td className="px-4 py-3 font-mono text-[#FBBF24]">{row.ticketNo}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{row.name}</p>
                  <p className="break-all">{row.email}</p>
                  <p>{row.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{row.college}</p>
                  <p className="text-[#A89DB5]">
                    {[row.branch, row.yearOfStudy].filter(Boolean).join(' · ')}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{STATUS_LABELS[row.status]}</p>
                  {row.status === 'pending' && row.seatHeldAt && (
                    <p className="text-[#A89DB5]">Until {formatDeadline(seatDeadline(row.seatHeldAt))}</p>
                  )}
                </td>
                <td className="px-4 py-3 font-mono break-all">{row.builderId ?? '—'}</td>
                <td className="px-4 py-3">
                  <p className="font-mono">{row.utr ?? '—'}</p>
                  {row.payerName && <p className="text-[#A89DB5]">{row.payerName}</p>}
                </td>
                <td className="px-4 py-3">
                  <RowActions id={row.id} name={row.name} status={row.status} builderId={row.builderId} utr={row.utr} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#A89DB5]">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
