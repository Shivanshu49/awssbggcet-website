'use client';

import { useEffect, useState } from 'react';

import { EVENT_SLUG } from '@/lib/registration/content';

// Fetched client-side so the page stays static. Hidden until there's a real capacity.
export function SeatCounter() {
  const [seats, setSeats] = useState<{ capacity: number | null; taken: number } | null>(null);

  useEffect(() => {
    fetch(`/api/events/${EVENT_SLUG}/seats`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setSeats)
      .catch(() => setSeats(null));
  }, []);

  if (!seats?.capacity) return null;

  const left = Math.max(seats.capacity - seats.taken, 0);
  return (
    <div className="mb-6 rounded-2xl border border-[#4C2A66]/50 bg-[#150D24] p-4">
      <p className="text-sm text-[#E9D5FF]">
        {left > 0 ? (
          <>
            <strong className="text-[#FBBF24]">
              {left} {left === 1 ? 'seat' : 'seats'} available
            </strong>{' '}
            out of {seats.capacity}
          </>
        ) : (
          <>
            <strong className="text-[#FBBF24]">Waitlist open</strong> — register to join the waitlist.
          </>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Seats taken"
        aria-valuemin={0}
        aria-valuemax={seats.capacity}
        aria-valuenow={Math.min(seats.taken, seats.capacity)}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#2B173D]"
      >
        <div
          className="h-full rounded-full bg-[#FBBF24]"
          style={{ width: `${Math.min((seats.taken / seats.capacity) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
