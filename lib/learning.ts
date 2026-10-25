import resourcesData from "@/content/resources.json";

/**
 * Topic taxonomy for the Learning page.
 *
 * Topics are derived from the learning paths that actually exist in
 * content/resources.json — a topic can never appear without real content,
 * and every path is assigned exactly one topic.
 */
export type PathTopicId = "fundamentals" | "fullstack" | "serverless" | "genai";

export interface PathTopic {
  id: PathTopicId;
  label: string;
}

export const PATH_TOPICS: readonly PathTopic[] = [
  { id: "fundamentals", label: "AWS Fundamentals" },
  { id: "fullstack", label: "Full-Stack Development" },
  { id: "serverless", label: "Serverless" },
  { id: "genai", label: "Generative AI" },
] as const;

/** Editorial mapping from the real path IDs in resources.json to a topic. */
const TOPIC_BY_PATH_ID: Record<string, PathTopicId> = {
  "path-fundamentals": "fundamentals",
  "path-fullstack": "fullstack",
  "path-serverless": "serverless",
  "path-genai": "genai",
};

export type LearningPathEntry = (typeof resourcesData.learningPaths)[number] & {
  topic: PathTopicId;
  topicLabel: string;
};

export function getLearningPaths(): LearningPathEntry[] {
  return resourcesData.learningPaths.map((path) => {
    const topic = TOPIC_BY_PATH_ID[path.id] ?? "fundamentals";
    const topicLabel =
      PATH_TOPICS.find((entry) => entry.id === topic)?.label ??
      "AWS Fundamentals";
    return { ...path, topic, topicLabel };
  });
}

export function getTopicLabel(topic: PathTopicId): string {
  return (
    PATH_TOPICS.find((entry) => entry.id === topic)?.label ?? "AWS Fundamentals"
  );
}

/** Count of learning paths per topic, keyed by topic id. */
export function getTopicCounts(
  paths: { topic: PathTopicId }[],
): Map<PathTopicId, number> {
  const counts = new Map<PathTopicId, number>();
  for (const path of paths) {
    counts.set(path.topic, (counts.get(path.topic) ?? 0) + 1);
  }
  return counts;
}

/**
 * Level badge colors tuned for the dark page surfaces used by the Learning
 * and Resources pages.
 */
export function levelBadgeClass(level: string): string {
  switch (level) {
    case "Beginner":
      return "border-emerald-500/30 bg-emerald-950/40 text-emerald-300";
    case "Beginner to Intermediate":
      return "border-lime-500/30 bg-lime-950/40 text-lime-300";
    case "Intermediate":
      return "border-amber-400/40 bg-amber-950/40 text-amber-300";
    case "Intermediate to Advanced":
      return "border-orange-400/30 bg-orange-950/40 text-orange-300";
    case "Advanced":
      return "border-rose-400/30 bg-rose-950/40 text-rose-300";
    default:
      return "border-[#4C2A66]/50 bg-[#171020] text-[#A89DB5]";
  }
}

/* ------------------------------------------------------------------ *
 * Detail-page relationships. Editorial mappings over real content —
 * every referenced ID exists in content/resources.json or
 * components/learning/learning-data.ts. Unknown IDs resolve to empty
 * results rather than throwing.
 * ------------------------------------------------------------------ */

/** Resource IDs from content/resources.json supporting each topic. */
const RESOURCES_BY_TOPIC: Record<PathTopicId, string[]> = {
  fundamentals: ["res-1"],
  fullstack: ["res-2"],
  serverless: ["res-8", "res-6"],
  genai: ["res-3"],
};

/** Suggested project IDs (learning-data.ts) that practice each path. */
const PROJECTS_BY_PATH: Record<string, string[]> = {
  "path-fundamentals": ["proj-1", "proj-3"],
  "path-fullstack": [],
  "path-serverless": ["proj-2", "proj-4"],
  "path-genai": [],
};

/** Honest prerequisite statements derived from what each path teaches. */
const PREREQUISITES_BY_PATH: Record<string, string[]> = {
  "path-fundamentals": [
    "No AWS experience required — the path starts from zero.",
    "A computer with a web browser and an email address to create a free-tier AWS account.",
  ],
  "path-fullstack": [
    "Comfortable writing JavaScript / TypeScript and React components.",
    "Completed the Cloud Foundations path (or equivalent IAM, budget, and S3 knowledge).",
  ],
  "path-serverless": [
    "Familiarity with AWS core services: IAM, S3, and DynamoDB.",
    "Working knowledge of a backend language such as Node.js or Python.",
  ],
  "path-genai": [
    "Comfort with REST APIs and an intermediate programming language (Python or TypeScript).",
    "A completed foundations path covering IAM roles and networking basics.",
  ],
};

/** Roadmap stage numbers (learning-data.ts ROADMAP_STAGES) each path covers. */
const ROADMAP_STAGES_BY_PATH: Record<string, number[]> = {
  "path-fundamentals": [1, 2, 3],
  "path-fullstack": [2, 3, 4],
  "path-serverless": [3, 4, 6],
  "path-genai": [4, 6],
};

export type ResourceEntry = (typeof resourcesData.items)[number];

export function getRelatedResourcesForPath(
  path: LearningPathEntry,
): ResourceEntry[] {
  const ids = RESOURCES_BY_TOPIC[path.topic] ?? [];
  return resourcesData.items.filter((item) => ids.includes(item.id));
}

/** A resource together with the learning paths it supports (may be none). */
export interface LinkedResource {
  resource: ResourceEntry;
  paths: LearningPathEntry[];
}

/**
 * Resources from content/resources.json that support at least one learning
 * path. Unlinked resources are excluded rather than forced into a fake
 * relationship; the Resources page remains the home for the full library.
 */
export function getResourcesLinkedToPaths(): LinkedResource[] {
  const paths = getLearningPaths();
  return resourcesData.items
    .map((resource) => ({
      resource,
      paths: paths.filter((path) =>
        (RESOURCES_BY_TOPIC[path.topic] ?? []).includes(resource.id),
      ),
    }))
    .filter((entry) => entry.paths.length > 0);
}

export type ProjectEntry = {
  id: string;
  title: string;
  difficulty: string;
  skillsLearned: string[];
  description: string;
  docUrl: string;
};

export function getSuggestedProjectsForPath(
  pathId: string,
  projects: ProjectEntry[],
): ProjectEntry[] {
  const ids = PROJECTS_BY_PATH[pathId] ?? [];
  return projects.filter((project) => ids.includes(project.id));
}

/** Learning paths a suggested project builds on (may be none). */
export function getPathsForProject(projectId: string): LearningPathEntry[] {
  return getLearningPaths().filter((path) =>
    (PROJECTS_BY_PATH[path.id] ?? []).includes(projectId),
  );
}

export function getPrerequisitesForPath(pathId: string): string[] {
  return PREREQUISITES_BY_PATH[pathId] ?? [];
}

export function getRoadmapStageNumbersForPath(pathId: string): number[] {
  return ROADMAP_STAGES_BY_PATH[pathId] ?? [];
}
