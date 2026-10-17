import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { EventImage } from "@/components/shared/EventImage";
import site from "@/content/site.json";
import eventsData from "@/content/events.json";

export const metadata: Metadata = {
  title: `${site.clubName} Events`,
  description: site.tagline,
};

export default function EventsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink">Events</h1>

      <p className="text-2xl text-ink-muted/80 mb-8">
        Build your skills and connect with the community
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {eventsData.map((event) => (
          <div
            key={event.slug}
            className="group rounded-lg bg-surface overflow-hidden hover:bg-surface-alt transition-colors"
          >
            {event.coverImage && (
              <EventImage src={event.coverImage} alt={event.title} />
            )}
            <div className="p-6">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-3">
                {event.mode}
              </span>
              <h3 className="text-lg font-semibold text-ink group-hover:text-aws-orange transition-colors mb-3">
                {event.title}
              </h3>
              <p className="text-sm text-ink-muted/70 mb-4">
                {new Date(event.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-ink-muted/70 mb-4">
                {event.venue}
              </p>
              <p className="text-sm text-ink-muted/70 mb-4">
                {event.description}
              </p>
              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aws-orange font-medium hover:underline"
                >
                  Register
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="/events"
          target="_blank"
          rel="noopener noreferrer"
          className="text-aws-orange font-medium hover:underline"
        >
          View All Events
        </a>
      </div>
    </Container>
  );
}
