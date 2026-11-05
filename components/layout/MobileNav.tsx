"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";

import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";
import { NavLink } from "./NavLink";

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
          className="text-white hover:bg-white/10 hover:text-[#FBBF24] lg:hidden shrink-0"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        {/* Raw Content: shadcn's DialogContent is a centred modal, this is a right-side sheet. */}
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-6 bg-[#090511]/95 backdrop-blur-xl border-l border-[#4C2A66]/50 p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] outline-none lg:hidden data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-[#150E22] border border-[#A855F7]/40 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.3)] shrink-0">
                <Image
                  src="/logo/sbg-logo.png"
                  alt="AWS Student Builder Group GCET Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <DialogTitle className="text-sm font-bold text-white tracking-tight">
                AWS Student Builder Group GCET
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
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
                  {/* DialogClose on each link = sheet closes on navigate. */}
                  <DialogClose asChild>
                    <NavLink
                      href={item.href}
                      className={cn(
                        "block rounded-xl border-l-4 border-transparent px-3.5 py-3 text-sm font-medium text-[#CFC5DC] transition-colors hover:bg-[#160E24] hover:text-[#FBBF24] aria-[current=page]:border-[#FBBF24] aria-[current=page]:bg-[#FBBF24]/10 aria-[current=page]:text-[#FBBF24] aria-[current=page]:font-semibold",
                        item.href === "/community-day" &&
                          "border-[#FBBF24]/70 bg-gradient-to-r from-[#FBBF24]/15 to-transparent font-semibold text-[#FDE68A] hover:bg-[#FBBF24]/20 hover:text-[#FBBF24] aria-[current=page]:border-[#FBBF24] aria-[current=page]:bg-[#FBBF24]/20 aria-[current=page]:text-[#FBBF24]",
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
                      className="flex w-full items-center gap-2 rounded-xl border-l-4 border-[#A855F7]/70 bg-gradient-to-r from-[#7E22CE]/20 via-[#A855F7]/15 to-transparent px-3.5 py-3 text-left text-sm font-semibold text-[#E9D5FF] hover:bg-[#A855F7]/25 hover:text-white transition-colors"
                    >
                      <span>🎉 Community Day &apos;26 Banner</span>
                    </button>
                  </DialogClose>
                </li>
              )}
            </ul>
          </nav>

          {joinFormUrl && (
            <Button
              asChild
              className="mt-auto h-11 rounded-xl bg-[#FBBF24] font-mono text-xs font-bold uppercase tracking-wider text-[#090511] shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:bg-[#F59E0B] transition-all"
            >
              <a href={joinFormUrl} target="_blank" rel="noopener noreferrer">
                Join Club
              </a>
            </Button>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
