import resourcesJson from "@/content/resources.json";
import type { ResourceItem } from "@/components/resources/resource-card";
import type { LearningPath } from "@/components/resources/learning-paths";

type ResourcesData = {
  sectionTitle: string;
  sectionEyebrow: string;
  intro: string;
  learningPaths: LearningPath[];
  items: ResourceItem[];
};

export function getResourcesData(): ResourcesData {
  return resourcesJson;
}
