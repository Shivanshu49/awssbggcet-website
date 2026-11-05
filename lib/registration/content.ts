import data from '@/content/event-pages/aws-student-community-day-2026.json';

export type JourneyStep = 'registered' | 'builder_id' | 'paid' | 'approved' | 'checked_in';

export type JourneyItem = {
  phase: 'before' | 'venue';
  step: JourneyStep | null; // null = informational, never tracked
  title: string;
  body?: string;
};

type EventPage = {
  registration: {
    open: boolean;
    capacity: number; // 0 = not set yet: the seed script writes NULL
    fee: number; // whole rupees; the only place the amount is stored
    upiId: string;
    upiQr: string; // path under public/, a QR with no preset amount
    collectMeal: boolean;
    builderIdRequired: boolean;
    builderIdSignupUrl: string;
    consentVersion: string;
  };
  allowOtherColleges: boolean;
  colleges: string[];
  branches: string[];
  workshops: string[];
  schedule: { time: string; title: string }[];
  faqs: { q: string; a: string }[];
  journey: JourneyItem[];
};

// ponytail: one event, one content file. Look this up by slug when a second event appears.
export const EVENT_SLUG = 'aws-student-community-day-2026';
export const eventPage = data as EventPage;
