import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import site from "@/content/site.json";
import { SOCIAL_LINKS } from "@/lib/constants";
import { SocialIcon } from "@/components/shared/SocialIcon";

export const metadata: Metadata = {
  title: `${site.clubName} Contact`,
  description: `Contact AWS Builder Center GCET at ${site.email}`,
};

export default function ContactPage() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink">Contact</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Get in Touch</h2>
          <p className="text-lg text-ink-muted/70">
            {site.email}
          </p>
          <p className="text-sm text-ink-muted/60 mt-2">
            Questions about our workshops? Ideas for a project? Want to become a
            sponsor? We would love to hear from you.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Find Us</h2>
          <p className="text-lg text-ink-muted/70">
            Galgotias College of Engineering & Technology
          </p>
          <p className="text-sm text-ink-muted/60">
            Greater Noida, Delhi NCR
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Connect</h2>
          <div className="space-y-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ink-muted/70 hover:text-aws-orange transition-colors"
              >
                <SocialIcon platform={social.platform} className="size-4" />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-12">
        <p className="text-lg text-ink-muted/70">
          © {new Date().getFullYear()} AWS Builder Center GCET. All rights reserved.
        </p>
      </div>
    </Container>
  );
}
