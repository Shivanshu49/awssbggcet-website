'use client';

import dynamic from 'next/dynamic';

// A client wrapper because next/dynamic only splits the bundle from a client component:
// while registration is closed this is never rendered, so zod and the form never load.
export const LazyRegistrationForm = dynamic(() =>
  import('./RegistrationForm').then((mod) => mod.RegistrationForm),
);
