import type { Metadata } from 'next';

import { FindPassForm } from '@/components/registration/FindPassForm';
import site from '@/content/site.json';
import { turnstileReady } from '@/lib/registration/turnstile';

export const metadata: Metadata = {
  title: 'Find my pass',
  description: 'Lost the link to your pass? We can email it to you again.',
};

export default function FindPassPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col gap-6 px-4 pt-4 pb-20 text-center text-[#F8FAFC] sm:px-6 sm:pt-14">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Find my pass</h1>
        <p className="mt-4 text-sm text-[#CFC5DC] sm:text-base">
          {turnstileReady ? (
            <>Enter the email you registered with and we&apos;ll send your pass link again.</>
          ) : (
            <>
              This isn&apos;t available right now. Email{' '}
              <a href={`mailto:${site.email}`} className="text-[#FBBF24] underline-offset-2 hover:underline">
                {site.email}
              </a>{' '}
              and we&apos;ll help you find your pass.
            </>
          )}
        </p>
      </div>
      {turnstileReady && <FindPassForm />}
    </section>
  );
}
