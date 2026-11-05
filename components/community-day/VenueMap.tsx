import { MapPin, Navigation, ExternalLink, ShieldAlert } from "lucide-react";
import data from "@/content/community-day.json";

export function VenueMap() {
  const { venue } = data;

  return (
    <section id="venue" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0a0814] to-slate-950 p-6 sm:p-10 lg:p-12 relative overflow-hidden backdrop-blur-xl shadow-xl">
        {/* Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-purple-700/15 rounded-full blur-3xl -z-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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

            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Capacity Notice: {venue.capacity} • Prior Registration Required</span>
            </div>

            <div className="pt-2">
              <a
                href={venue.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-3 text-sm transition-all shadow-md shadow-purple-600/20 hover:scale-105 active:scale-95 group"
              >
                <Navigation className="w-4 h-4 text-purple-200" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Arrival Guidelines
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Entry starts promptly at <strong>09:30 AM IST</strong> at the Auditorium Foyer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Keep your digital pass QR code ready on your mobile device for desk scanning.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Carry a valid College ID Card along with your entry pass for physical verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Bring your personal laptop and charger for active participation in the hands-on tracks.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
