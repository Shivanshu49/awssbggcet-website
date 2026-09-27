import site from "@/content/site.json";
import { NAV_ITEMS } from "@/lib/constants";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo className="text-ink" />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="block border-b-2 border-transparent px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink aria-[current=page]:border-aws-orange aria-[current=page]:text-ink"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="brand"
            size="lg"
            className="hidden sm:inline-flex"
          >
            <a
              href={site.joinFormUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Club
            </a>
          </Button>
          <MobileNav joinFormUrl={site.joinFormUrl} />
        </div>
      </Container>
    </header>
  );
}
