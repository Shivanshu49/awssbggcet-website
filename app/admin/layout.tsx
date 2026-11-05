import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

// No access check here: a layout doesn't re-run on every navigation, so each page does its own.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 pt-4 pb-20 text-[#F8FAFC] sm:px-6 sm:pt-10">{children}</div>;
}
