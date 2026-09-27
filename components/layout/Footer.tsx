import Link from "next/link";
import { Mail } from "lucide-react";

import site from "@/content/site.json";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { SocialIcon } from "@/components/shared/SocialIcon";

export function Footer() {
  return (
    <footer className="bg-aws-squid text-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm text-surface/75">{site.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-2 text-sm break-all text-surface/75 hover:text-surface"
          >
            <Mail aria-hidden className="size-4 shrink-0" />
            {site.email}
          </a>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold">Quick links</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-surface/75 hover:text-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Connect with us</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-10 place-items-center rounded-lg bg-surface/10 transition-colors hover:bg-aws-orange hover:text-ink"
                >
                  <SocialIcon platform={social.platform} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-surface/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-surface/75 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.clubName}. Brought to you by
            GCET.
          </p>
          <p>Thanks for visiting. See you at the next build session.</p>
        </Container>
      </div>
    </footer>
  );
}
