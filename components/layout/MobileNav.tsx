"use client";

import { Menu, X } from "lucide-react";

import { NAV_ITEMS } from "@/lib/constants";
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

export function MobileNav({ joinFormUrl }: { joinFormUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-aws-squid/60 md:hidden" />
        {/* Raw Content: shadcn's DialogContent is a centred modal, this is a right-side sheet. */}
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-6 bg-surface p-6 text-ink shadow-xl outline-none md:hidden data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Menu</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon-lg" aria-label="Close menu">
                <X className="size-5" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="sr-only">
            Site navigation
          </DialogDescription>

          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  {/* DialogClose on each link = sheet closes on navigate. */}
                  <DialogClose asChild>
                    <NavLink
                      href={item.href}
                      className="block rounded-lg border-l-4 border-transparent px-3 py-3 text-base font-medium text-ink-muted hover:bg-surface-alt hover:text-ink aria-[current=page]:border-aws-orange aria-[current=page]:bg-surface-alt aria-[current=page]:text-ink"
                    >
                      {item.label}
                    </NavLink>
                  </DialogClose>
                </li>
              ))}
            </ul>
          </nav>

          <Button asChild variant="brand" size="lg" className="mt-auto h-11">
            <a href={joinFormUrl} target="_blank" rel="noopener noreferrer">
              Join Club
            </a>
          </Button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
