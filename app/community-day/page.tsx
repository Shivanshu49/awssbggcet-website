import type { Metadata } from "next";
import { Hero } from "@/components/community-day/Hero";
import { SubNav } from "@/components/community-day/SubNav";
import { InfoCards } from "@/components/community-day/InfoCards";
import { About } from "@/components/community-day/About";
import { Highlights } from "@/components/community-day/Highlights";
import { Schedule } from "@/components/community-day/Schedule";
import { Speakers } from "@/components/community-day/Speakers";
import { Journey } from "@/components/community-day/Journey";
import { FAQ } from "@/components/community-day/FAQ";
import { VenueMap } from "@/components/community-day/VenueMap";
import { FinalCTA } from "@/components/community-day/FinalCTA";

export const metadata: Metadata = {
  title: "AWS Student Community Day 2026 | GCET Auditorium",
  description:
    "Official summit page for AWS Student Community Day 2026 at Galgotias College of Engineering & Technology. 21st Nov 2026. Entry fee ₹45. 200 seats only. Register now!",
};

export default function CommunityDayPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 overflow-x-hidden selection:bg-amber-400 selection:text-black">
      <Hero />
      <SubNav />
      <InfoCards />
      <About />
      <Highlights />
      <Schedule />
      <Speakers />
      <Journey />
      <FAQ />
      <VenueMap />
      <FinalCTA />
    </main>
  );
}
