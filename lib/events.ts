import eventsData from "@/content/events.json";

// Data seam: swap the JSON import for an API call later. All date logic
// lives here; components must never filter or sort events themselves.

export type Event = {
  slug: string;
  title: string;
  date: string;
  endDate?: string;
  mode: "online" | "offline" | "hybrid";
  venue: string;
  description: string;
  registrationUrl: string;
  coverImage?: string;
  attendees?: number;
  gallery?: string[];
};

const events = eventsData as Event[];

// An event stays "upcoming" until it ends, so multi-day events don't flip to
// past on day one. `now` is evaluated when the page renders (build time for
// static pages), so a rebuild or revalidate is needed for events to roll over.
function endsAt(event: Event) {
  return new Date(event.endDate ?? event.date).getTime();
}

export function getUpcoming(now = new Date()): Event[] {
  return events
    .filter((event) => endsAt(event) >= now.getTime())
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

export function getPast(now = new Date()): Event[] {
  return events
    .filter((event) => endsAt(event) < now.getTime())
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
