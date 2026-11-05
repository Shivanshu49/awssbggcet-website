import { MapPin, Navigation, ExternalLink, ShieldAlert, Compass } from "lucide-react";
import data from "@/content/community-day.json";

export function VenueMap() {
  const { venue } = data;

  const lat = "28.4571859";
  const lng = "77.4984560";

  return (
    <section id="venue" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0a0814] to-slate-950 p-6 sm:p-10 lg:p-12 relative overflow-hidden backdrop-blur-xl shadow-xl">
        {/* Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-purple-700/15 rounded-full blur-3xl -z-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Venue Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Venue &amp; Location</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {venue.name}
              </h2>
              <p className="text-amber-400 font-semibold text-sm sm:text-base mt-1">
                {venue.institution}
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {venue.address}
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Capacity: {venue.capacity}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono">
                <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{lat}° N, {lng}° E</span>
              </span>
            </div>

            <div className="pt-2">
              <a
                href={venue.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3.5 text-sm transition-all shadow-md shadow-purple-600/25 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 group"
              >
                <Navigation className="w-4 h-4 text-purple-200" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Arrival Guidelines */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Arrival Guidelines</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Entry desk opens promptly at <strong className="text-white">09:30 AM IST</strong> at the Auditorium Foyer.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Keep your digital pass QR code ready on your phone for rapid desk verification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Carry your physical College ID card alongside your entry pass.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Bring your personal laptop and charger for hands-on technical sessions.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Embedded Interactive Google Map */}
        <div className="mt-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner relative group">
          <iframe
            title="Galgotias College of Engineering and Technology Auditorium Google Maps Location"
            src="https://maps.google.com/maps?q=28.457185904700307,77.49845600782581&hl=en&z=17&output=embed"
            className="w-full h-64 sm:h-80 md:h-96 border-0 filter invert-[90%] hue-rotate-180 contrast-[1.1] opacity-90 group-hover:opacity-100 transition-opacity"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-slate-300 shadow">
              28.4572° N, 77.4985° E
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
