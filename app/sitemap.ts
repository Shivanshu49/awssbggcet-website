import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getLearningPaths } from "@/lib/learning";

// Public pages only. Not /pass or /admin, and not /privacy or /event-policies while they're noindex drafts.
const PATHS = ["/", "/about", "/events", "/community-day", "/community-day/register", "/learning", "/resources", "/contact", "/login"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PATHS, ...getLearningPaths().map((path) => `/learning/${path.id}`)].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
