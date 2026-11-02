'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Ticket } from 'lucide-react';

import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { NavLink } from './NavLink';

export function MobileNav({
  joinFormUrl,
  onOpenBanner,
}: {
  joinFormUrl: string;
  onOpenBanner?: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-white hover:bg-white/10 hover:text-gold lg:hidden focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-6 bg-gradient-to-b from-deep-purple via-[#190F2E] to-black p-6 text-white border-l border-vibrant-pink/30 shadow-2xl outline-none lg:hidden data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#150E22] border border-[#A855F7]/40 flex items-center justify-center shadow-sm shrink-0">
                <Image
                  src="/logo/sbg-logo.png"
                  alt="AWS Builder Center GCET Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <DialogTitle className="text-sm font-bold text-white">
                AWS Builder Center
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="text-white hover:text-gold hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="sr-only">
            Site navigation
          </DialogDescription>

          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <DialogClose asChild>
                    <NavLink
                      href={item.href}
                      className={cn(
                        'block rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-gold transition-colors focus:outline-none',
                        item.href === '/community-day' &&
                          'border border-gold/40 bg-gold/10 font-semibold text-gold shadow-sm',
                      )}
                    >
                      {item.label}
                    </NavLink>
                  </DialogClose>
                </li>
              ))}
              {onOpenBanner && (
                <li>
                  <DialogClose asChild>
                    <button
                      type="button"
                      onClick={onOpenBanner}
                      className="flex w-full items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3.5 py-2.5 text-left text-sm font-semibold text-gold hover:bg-gold/20 transition-all focus:outline-none"
                    >
                      <span>🎉 Community Day &apos;26 Banner</span>
                    </button>
                  </DialogClose>
                </li>
              )}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <DialogClose asChild>
              <Link
                href="/community-day/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_15px_rgba(244,163,0,0.3)] hover:brightness-110 active:scale-95 transition-all"
              >
                <Ticket className="size-4" />
                <span>Register Now</span>
              </Link>
            </DialogClose>

            {joinFormUrl && (
              <Button asChild variant="brand" size="lg" className="h-10 text-xs">
                <a href={joinFormUrl} target="_blank" rel="noopener noreferrer">
                  Join Club
                </a>
              </Button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
