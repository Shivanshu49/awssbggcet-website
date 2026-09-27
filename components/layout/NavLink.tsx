"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = React.ComponentProps<typeof Link> & { href: string };

// Client only for usePathname. Style the active state with
// aria-[current=page]: variants at the call site.
export function NavLink({ href, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} aria-current={active ? "page" : undefined} {...props} />
  );
}
