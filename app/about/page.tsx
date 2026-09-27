import type { Metadata } from "next";

import { Container } from "@/components/shared/Container";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink">About</h1>
    </Container>
  );
}
