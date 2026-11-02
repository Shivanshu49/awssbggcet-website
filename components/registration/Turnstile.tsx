'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

// Cloudflare's documented always-pass test key, for `next dev` only. A production build never
// renders this widget without both keys (see turnstileReady).
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

// A token works once, so the parent bumps resetSignal after every server reply.
export function Turnstile({
  onToken,
  resetSignal,
}: {
  onToken: (token: string) => void;
  resetSignal: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  const render = useCallback(() => {
    if (!window.turnstile || !container.current || widget.current) return;
    widget.current = window.turnstile.render(container.current, {
      sitekey: SITE_KEY,
      theme: 'dark',
      callback: onToken,
      'expired-callback': () => onToken(''),
      'error-callback': () => onToken(''),
    });
  }, [onToken]);

  useEffect(() => {
    render();
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [render]);

  useEffect(() => {
    if (resetSignal && widget.current) {
      onToken('');
      window.turnstile?.reset(widget.current);
    }
  }, [resetSignal, onToken]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={render}
      />
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}
