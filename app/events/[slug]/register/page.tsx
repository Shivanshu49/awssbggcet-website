import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import eventsData from '@/content/events.json';
import { RegistrationPageClient } from './RegistrationPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = (eventsData as any[]).find((e) => e.slug === slug);
  if (!event) return { title: 'Event Registration' };

  return {
    title: `Register for ${event.title}`,
    description: event.description,
  };
}

export default async function EventRegisterPage({ params }: Props) {
  const { slug } = await params;
  const event = (eventsData as any[]).find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const eventTime = new Date(event.date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <div className="min-h-screen bg-[#090511] text-[#F8FAFC] pb-24">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-900/15 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-amber-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {/* Event Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#4C2A66]/60 bg-[#120B1C] shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-12">
          {event.coverImage && (
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                priority
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120B1C] via-[#120B1C]/60 to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-10 -mt-20 sm:-mt-24 relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#211235] text-amber-300 border border-amber-400/40">
                Official Event Registration
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-950/60 text-purple-200 border border-purple-500/40">
                {event.mode.toUpperCase()}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-sm sm:text-base text-[#A89DB5] mt-3 max-w-3xl leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#4C2A66]/40">
              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[#A89DB5] text-[11px] font-mono uppercase">Date & Time</p>
                  <p className="font-semibold text-white">{eventDate} • {eventTime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[#A89DB5] text-[11px] font-mono uppercase">Venue</p>
                  <p className="font-semibold text-white line-clamp-1">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <Users className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[#A89DB5] text-[11px] font-mono uppercase">Eligibility</p>
                  <p className="font-semibold text-white">All College Students & Cloud Builders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client-side Multi-Step Form or Success Screen */}
        <RegistrationPageClient
          eventSlug={slug}
          eventTitle={event.title}
          eventDate={eventDate}
          eventTime={eventTime}
          venue={event.venue}
        />
      </div>
    </div>
  );
}

