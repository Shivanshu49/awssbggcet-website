import type { Metadata } from 'next';

import { LegalPage } from '@/components/shared/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  robots: { index: false }, // Remove once real text replaces the draft.
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Notice" file="privacy.md" />;
}
