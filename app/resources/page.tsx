import type { Metadata } from "next";

import { Container } from "@/components/shared/Container";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink">Resources</h1>
    </Container>
  );
}
