import site from "@/content/site.json";

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { platform: "linkedin", label: "LinkedIn", href: site.socials.linkedin },
  { platform: "instagram", label: "Instagram", href: site.socials.instagram },
  { platform: "x", label: "X", href: site.socials.x },
  { platform: "github", label: "GitHub", href: site.socials.github },
  { platform: "discord", label: "Discord", href: site.socials.discord },
] as const;

export type SocialPlatform = (typeof SOCIAL_LINKS)[number]["platform"];
