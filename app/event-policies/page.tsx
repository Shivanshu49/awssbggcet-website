import type { Metadata } from 'next';

import { LegalPage } from '@/components/shared/LegalPage';

export const metadata: Metadata = {
  title: 'Event Policies',
  robots: { index: false }, // Remove once real text replaces the draft.
};

export default function EventPoliciesPage() {
  return <LegalPage title="Event Policies" file="event-policies.md" />;
}
